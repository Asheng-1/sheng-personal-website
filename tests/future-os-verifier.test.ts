import { describe, expect, it } from "vitest";
import {
  hasContractFailure,
  inspectBuiltPage,
} from "../scripts/verify-built-site.mjs";

const futureOsHero = `<main>
  <section id="top" data-interface="personal-os">
    <aside class="hero__identity-panel" aria-label="数字身份">
      <picture class="hero__avatar">
        <source type="image/avif" srcset="/avatar-96.avif 96w, /avatar-192.avif 192w">
        <source type="image/webp" srcset="/avatar-96.webp 96w, /avatar-192.webp 192w">
        <img src="/avatar.jpg" width="192" height="189" alt="Sheng 常用头像">
      </picture>
      <p>SHENG / DIGITAL ID</p>
      <strong>SHENG</strong>
      <span>AI TRAINER IN PROGRESS</span>
    </aside>
    <div class="hero__copy">
      <h1>保持好奇，探索未知。</h1>
      <p class="hero__intro">正在把好奇，训练成判断力。</p>
    </div>
    <div class="hero__status-panel" aria-label="个人状态">
      <dl>
        <dt>ROLE</dt><dd>AI 训练师</dd>
        <dt>FOCUS</dt><dd>认知 × 创造力</dd>
        <dt>MODE</dt><dd>探索 / 学习 / 构建</dd>
      </dl>
    </div>
    <div class="hero__visual">
      <div class="hero__scan-ring" aria-hidden="true"></div>
      <picture><img src="/portrait.png" alt="Sheng 的 3D IP 形象"></picture>
    </div>
  </section>
</main>`;

describe("future operating system homepage contract", () => {
  it("accepts a readable personal OS with identity, status and a safe scan layer", () => {
    expect(inspectBuiltPage(futureOsHero, "home")).toMatchObject({
      futureOsInterfaceValid: true,
      identityAvatarValid: true,
      heroSignatureValid: true,
    });
  });

  it("rejects the homepage when its digital identity module disappears", () => {
    const withoutIdentity = futureOsHero.replace(
      /<aside class="hero__identity-panel"[\s\S]*?<\/aside>/,
      "",
    );
    const result = inspectBuiltPage(withoutIdentity, "home");

    expect(result.futureOsInterfaceValid).toBe(false);
    expect(hasContractFailure({ home: result })).toBe(true);
  });

  it("rejects the homepage when the digital identity avatar disappears", () => {
    const withoutAvatar = futureOsHero.replace(
      /<picture class="hero__avatar">[\s\S]*?<\/picture>/,
      "",
    );
    const result = inspectBuiltPage(withoutAvatar, "home");

    expect(result.identityAvatarValid).toBe(false);
    expect(hasContractFailure({ home: result })).toBe(true);
  });

  it("rejects the homepage when the visible signature uses the old wording", () => {
    const oldSignature = futureOsHero.replace("探索未知", "奔赴未知");
    const result = inspectBuiltPage(oldSignature, "home");

    expect(result.heroSignatureValid).toBe(false);
    expect(hasContractFailure({ home: result })).toBe(true);
  });
});
