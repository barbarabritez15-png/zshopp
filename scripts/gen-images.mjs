import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT = '/home/z/my-project/public/products';
const HERO = '/home/z/my-project/public/hero.png';

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const PRODUCTS = [
  { slug: 'aurora-noise-cancelling-headphones', name: 'Aurora Wireless Noise-Cancelling Headphones' },
  { slug: 'pulse-smart-watch-series-7', name: 'Pulse Smart Watch Series 7' },
  { slug: 'vortex-4k-action-camera', name: 'Vortex 4K Action Camera' },
  { slug: 'sonic-bluetooth-speaker', name: 'Sonic Bluetooth Portable Speaker' },
  { slug: 'nimbus-ultrabook-14', name: 'Nimbus Ultrabook 14 inch Laptop' },
  { slug: 'glide-wireless-mouse', name: 'Glide Wireless Mouse' },
  { slug: 'vista-27-4k-monitor', name: 'Vista 27 inch 4K Monitor' },
  { slug: 'linkpro-usb-c-hub', name: 'LinkPro USB-C Hub 8-in-1' },
  { slug: 'brewmaster-espresso-machine', name: 'BrewMaster Espresso Machine' },
  { slug: 'crispair-air-fryer', name: 'CrispAir Air Fryer 5.5L' },
  { slug: 'roombabot-robot-vacuum', name: 'RoombaBot Robot Vacuum Cleaner' },
  { slug: 'chefpro-cookware-set', name: 'ChefPro Cookware Set 10-Piece' },
  { slug: 'echobuds-true-wireless-earbuds', name: 'EchoBuds True Wireless Earbuds' },
  { slug: 'retrospin-vinyl-record-player', name: 'RetroSpin Vinyl Record Player' },
  { slug: 'studioone-monitor-headphones', name: 'StudioOne Monitor Headphones' },
  { slug: 'fittrack-fitness-band', name: 'FitTrack Fitness Band' },
  { slug: 'halo-smart-ring', name: 'Halo Smart Ring Health Monitor' },
  { slug: 'strikepad-gaming-controller', name: 'StrikePad Wireless Gaming Controller' },
  { slug: 'glowmat-rgb-gaming-mousepad', name: 'GlowMat RGB Gaming Mouse Pad' },
  { slug: 'visionmax-vr-headset', name: 'VisionMax VR Headset' },
  { slug: 'powercore-20000-power-bank', name: 'PowerCore 20000mAh Power Bank' },
  { slug: 'cloudkey-mechanical-keyboard', name: 'CloudKey Mechanical Keyboard' },
];

function promptFor(name) {
  return `Professional e-commerce product photography of ${name}, isolated on a clean pure white background, centered composition, soft even studio lighting, crisp focus, high detail, photorealistic, no text, no watermark`;
}

async function gen(zai, prompt, size, outPath, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await zai.images.generations.create({ prompt, size });
      const b64 = res.data[0].base64;
      fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
      return true;
    } catch (e) {
      console.error(`  attempt ${attempt} failed: ${e.message}`);
      if (attempt < retries) await new Promise((r) => setTimeout(r, 3000));
    }
  }
  return false;
}

async function main() {
  const zai = await ZAI.create();
  let ok = 0, fail = 0;
  const failed = [];
  for (const p of PRODUCTS) {
    const out = path.join(OUT, `${p.slug}.png`);
    if (fs.existsSync(out) && fs.statSync(out).size > 10000) {
      console.log(`skip (exists): ${p.slug}`);
      ok++; continue;
    }
    console.log(`generating: ${p.slug}`);
    const success = await gen(zai, promptFor(p.name), '1024x1024', out);
    if (success) { ok++; console.log(`  ok`); }
    else { fail++; failed.push(p.slug); console.log(`  FAILED: ${p.slug}`); }
  }
  if (!fs.existsSync(HERO) || fs.statSync(HERO).size < 10000) {
    console.log('generating hero banner');
    const heroPrompt = 'Wide cinematic e-commerce hero banner, modern tech gadgets and lifestyle products arranged elegantly on the right side, warm gradient background from amber gold to deep charcoal, soft studio lighting, premium minimal aesthetic, lots of empty negative space on the left, photorealistic, high detail, no text';
    await gen(zai, heroPrompt, '1344x768', HERO);
  }
  console.log(`DONE. ok=${ok} fail=${fail} failed=${JSON.stringify(failed)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
