"use client";

import { useEffect, useRef } from "react";
import {
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import type { Content } from "@/content/types";

type SceneLabels = Content["hero"]["scene"]["labels"];

/**
 * The hero scene: a low-poly road network — your app on one side, the road runs
 * to the Y fork and splits to the three providers. Payments travel it and take a
 * branch. Occasionally one reaches a provider, stalls with a subtle "timeout"
 * pulse and WAITS THERE — it never jumps to another branch. That is the
 * no-failover rule, shown (website/PLAN.md §5a).
 *
 * Decorative only: the canvas is aria-hidden, the section carries a text
 * description, and the parent renders a static SVG until (or instead of) this.
 */

// A flat ribbon mesh following a curve: the road. Low-poly: 40 segments ≈ 80 triangles.
function ribbon(curve: CatmullRomCurve3, width: number, segments = 40): BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  const point = new Vector3();
  const tangent = new Vector3();
  const normal = new Vector3();
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    curve.getPoint(t, point);
    curve.getTangent(t, tangent);
    normal.set(-tangent.z, 0, tangent.x).normalize();
    const hw = width / 2;
    positions.push(point.x + normal.x * hw, 0, point.z + normal.z * hw);
    positions.push(point.x - normal.x * hw, 0, point.z - normal.z * hw);
    if (i < segments) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  return geometry;
}

// Theme colours, read from the CSS variables so the scene matches light/dark.
function readPalette() {
  const style = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
  return {
    accent: new Color(v("--accent", "#b5532e")),
    ink: new Color(v("--ink", "#1d1b18")),
    muted: new Color(v("--muted", "#6b655b")),
    packet: new Color(v("--ink", "#f4efe6")),
    parked: new Color(v("--muted", "#6b655b")),
  };
}

type Packet = {
  mesh: Mesh<SphereGeometry, MeshBasicMaterial>;
  phase: "trunk" | "branch" | "parked";
  t: number;
  speed: number;
  branch: number;
  willTimeout: boolean;
  parkedTime: number;
};

export default function HeroScene({
  onReady,
  paused,
  labels,
}: {
  onReady: () => void;
  paused: boolean;
  labels: SceneLabels;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    const disposables: { dispose(): void }[] = [];
    const cleanupFns: (() => void)[] = [];

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return; // no WebGL after all: the parent keeps showing the static SVG
    }
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
    host.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(42, 1, 0.1, 100);
    const cameraBase = new Vector3(0, 10.4, 11.4);
    camera.position.copy(cameraBase);
    camera.lookAt(0.35, 0, 0.1);

    const palette = readPalette();

    // ---- geometry -----------------------------------------------------------
    const roadMat = new MeshBasicMaterial({ color: palette.accent, side: DoubleSide });
    const nodeMat = new MeshBasicMaterial({ color: palette.muted });
    const providerMat = new MeshBasicMaterial({ color: palette.muted });
    const packetMat = new MeshBasicMaterial({ color: palette.packet });
    const parkedMat = new MeshBasicMaterial({ color: palette.parked });
    disposables.push(roadMat, nodeMat, providerMat, packetMat, parkedMat);

    const fork = new Vector3(0.7, 0, 0);
    const appPos = new Vector3(-5.9, 0, 0);
    const providerPos = [
      new Vector3(5.8, 0, -2.9),
      new Vector3(6.6, 0, 0),
      new Vector3(5.8, 0, 2.9),
    ];
    const trunkCurve = new CatmullRomCurve3([appPos, fork]);
    const branchCurves = providerPos.map(
      (p) => new CatmullRomCurve3([fork, new Vector3(2.6, 0, p.z * 0.24), p]),
    );

    for (const curve of [trunkCurve, ...branchCurves]) {
      const geometry = ribbon(curve, 0.52);
      disposables.push(geometry);
      scene.add(new Mesh(geometry, roadMat));
    }

    const appNode = new Mesh(new BoxGeometry(0.95, 0.95, 0.95), nodeMat);
    appNode.position.set(appPos.x, 0.48, 0);
    appNode.rotation.y = Math.PI / 4;
    scene.add(appNode);
    disposables.push(appNode.geometry);
    for (const p of providerPos) {
      const node = new Mesh(new CylinderGeometry(0.5, 0.5, 0.32, 20), providerMat);
      node.position.set(p.x, 0.16, p.z);
      scene.add(node);
      disposables.push(node.geometry);
    }

    // ---- packets ------------------------------------------------------------
    const packetGeometry = new SphereGeometry(0.15, 10, 8);
    disposables.push(packetGeometry);
    const packets: Packet[] = [];
    const parked: Packet[] = [];
    function spawnPacket() {
      const mesh = new Mesh(packetGeometry, packetMat);
      mesh.position.set(appPos.x, 0.32, 0);
      scene.add(mesh);
      packets.push({
        mesh,
        phase: "trunk",
        t: 0,
        speed: 1.1 + Math.random() * 0.25,
        branch: 0,
        willTimeout:
          parked.length + packets.filter((p) => p.willTimeout).length < 3 && Math.random() < 0.14,
        parkedTime: 0,
      });
    }
    function recycle(packet: Packet) {
      scene.remove(packet.mesh);
      const i = packets.indexOf(packet);
      if (i >= 0) packets.splice(i, 1);
      const j = parked.indexOf(packet);
      if (j >= 0) parked.splice(j, 1);
    }

    // ---- HTML labels over the canvas ---------------------------------------
    const labelHost = document.createElement("div");
    labelHost.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden";
    host.appendChild(labelHost);
    const labelTexts = [
      {
        text: labels.app,
        anchor: new Vector3(appPos.x + 0.55, 1.5, 0),
        className: "color:var(--muted)",
      },
      {
        text: labels.yoon,
        anchor: new Vector3(fork.x, 1.1, 0.2),
        className: "color:var(--accent)",
      },
      ...labels.providers.map((text, i) => ({
        text,
        anchor: providerPos[i].clone().setY(1.05),
        className: "color:var(--muted)",
      })),
    ];
    const labelEls = labelTexts.map(({ text, className }) => {
      const el = document.createElement("span");
      el.textContent = text;
      el.style.cssText = `position:absolute;left:0;top:0;transform:translate(-50%,-50%);font:600 12px/1 var(--font-ubuntu-sans),sans-serif;white-space:nowrap;transition:color .4s;${className}`;
      labelHost.appendChild(el);
      return el;
    });
    const projected = new Vector3();
    const projectLabels = () => {
      for (let i = 0; i < labelEls.length; i++) {
        projected.copy(labelTexts[i].anchor).project(camera);
        const el = labelEls[i];
        if (projected.z > 1) {
          el.style.visibility = "hidden";
          continue;
        }
        el.style.visibility = "visible";
        // transforms only: per-frame layout would cost too much (PLAN.md §7)
        el.style.transform = `translate(${(projected.x * 0.5 + 0.5) * host.clientWidth}px, ${
          (-projected.y * 0.5 + 0.5) * host.clientHeight
        }px) translate(-50%, -50%)`;
      }
    };

    // ---- theme changes ------------------------------------------------------
    const applyPalette = () => {
      const next = readPalette();
      roadMat.color.copy(next.accent);
      nodeMat.color.copy(next.ink);
      providerMat.color.copy(next.muted);
      packetMat.color.copy(next.packet);
      parkedMat.color.copy(next.parked);
    };
    const themeObserver = new MutationObserver(applyPalette);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // ---- sizing -------------------------------------------------------------
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, window.innerWidth < 640 ? 1 : 1.5),
    );
    const resize = () => {
      if (disposed) return;
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    // ---- pointer parallax (desktop only) ------------------------------------
    const target = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    function onPointerMove(event: PointerEvent) {
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
    }
    if (finePointer) window.addEventListener("pointermove", onPointerMove, { passive: true });

    // ---- render loop, gated by visibility and pause -------------------------
    let raf = 0;
    let running = false;
    let inView = true;
    let frameTimes: number[] = [];
    let last = performance.now();
    let clock = 0;
    let spawnTimer = 0.4;

    const point = new Vector3();
    function frame(now: number) {
      raf = 0;
      if (disposed) return;
      const rawDt = now - last; // ms
      last = now;
      clock += Math.min(rawDt / 1000, 0.05);

      // fps watchdog: sustained frame times above 32 ms → freeze at a static frame
      frameTimes.push(rawDt);
      if (frameTimes.length > 40) frameTimes.shift();
      if (frameTimes.length === 40 && frameTimes.reduce((a, b) => a + b, 0) / 40 > 32) {
        renderer.render(scene, camera);
        running = false;
        return;
      }

      // camera drift + parallax
      smooth.x += (target.x - smooth.x) * 0.05;
      smooth.y += (target.y - smooth.y) * 0.05;
      camera.position.set(
        cameraBase.x + Math.sin(clock * 0.12) * 0.25 + smooth.x * 0.5,
        cameraBase.y + Math.sin(clock * 0.09) * 0.15 - smooth.y * 0.25,
        cameraBase.z + Math.cos(clock * 0.1) * 0.25,
      );
      camera.lookAt(0.35, 0, 0.1);

      // spawn
      spawnTimer -= Math.min(rawDt / 1000, 0.05);
      if (spawnTimer <= 0 && packets.length < 10) {
        spawnPacket();
        spawnTimer = 0.75 + Math.random() * 0.7;
      }

      // move packets
      for (const packet of [...packets]) {
        if (packet.phase === "trunk") {
          packet.t += packet.speed * Math.min(rawDt / 1000, 0.05);
          if (packet.t >= 1) {
            packet.phase = "branch";
            packet.t = 0;
            packet.branch = Math.floor(Math.random() * 3);
          } else {
            trunkCurve.getPoint(packet.t, point);
            packet.mesh.position.set(point.x, 0.32, point.z);
          }
        } else if (packet.phase === "branch") {
          packet.t += packet.speed * Math.min(rawDt / 1000, 0.05);
          if (packet.t >= 1) {
            recycle(packet); // delivered
            continue;
          }
          if (packet.willTimeout && packet.t >= 0.78) {
            packet.phase = "parked"; // stops on the road — never switches branch
            packet.t = 0.78;
            parked.push(packet);
            continue;
          }
          branchCurves[packet.branch].getPoint(packet.t, point);
          packet.mesh.position.set(point.x, 0.32, point.z);
        } else {
          // parked: subtle "timeout" pulse, then it waits there
          packet.parkedTime += Math.min(rawDt / 1000, 0.05);
          const pulse =
            Math.max(0, Math.sin(packet.parkedTime * 5)) * Math.max(0, 1 - packet.parkedTime / 1.8);
          packet.mesh.scale.setScalar(1 + pulse * 0.7);
          packet.mesh.material = pulse > 0.05 ? packetMat : parkedMat;
          branchCurves[packet.branch].getPoint(packet.t, point);
          packet.mesh.position.set(point.x, 0.32, point.z);
          if (packet.parkedTime > 10 && parked.length > 2) recycle(packet);
        }
      }

      renderer.render(scene, camera);
      projectLabels();
      onReadyRef.current();
      schedule();
    }

    function schedule() {
      if (!running || disposed) return;
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (running || disposed) return;
      running = true;
      last = performance.now();
      frameTimes = [];
      schedule();
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
    function sync() {
      if (pausedRef.current || !inView || document.hidden) stop();
      else start();
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: "80px" },
    );
    intersectionObserver.observe(host);
    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    // first static render so the fade-in has content even while paused
    resize();
    renderer.render(scene, camera);
    projectLabels();
    onReadyRef.current();

    cleanupFns.push(() => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (finePointer) window.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      host.removeChild(renderer.domElement);
      host.removeChild(labelHost);
      for (const d of disposables) d.dispose();
    });

    return () => {
      for (const fn of cleanupFns) fn();
    };
    // Stable for the lifetime of the mount: labels and the ready callback are held
    // in refs, so the scene is built once and never rebuilt on parent re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={hostRef} className="absolute inset-0" />;
}
