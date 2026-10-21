#!/usr/bin/env node
/**
 * PNG del logotipo para el `logo` del JSON-LD (Organization / HomeAndConstructionBusiness).
 *
 *     node scripts/generar-logo.mjs   -> public/images/logo-pergola-plus-florida.png
 *
 * Google pide una URL a una imagen >= 112x112 px, rasterizable (PNG/JPG), que se vea
 * bien sobre fondo blanco. El unico logotipo de la empresa en el repo es
 * public/images/Logo-White.svg (blanco), asi que se compone sobre el color primario
 * de la marca (#3a545b), que es exactamente como se ve en el nav y el pie del sitio.
 * 512x512, logo centrado al 80 % del ancho. No es una foto: no hay AVIF que valga aqui.
 */
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.resolve(import.meta.dirname, '..');
const LADO = 512;
const logo = await sharp(path.join(RAIZ, 'public/images/Logo-White.svg'), { density: 300 })
  .resize({ width: Math.round(LADO * 0.8), fit: 'inside' }).png().toBuffer();
const meta = await sharp(logo).metadata();
await sharp({ create: { width: LADO, height: LADO, channels: 4, background: '#3a545b' } })
  .composite([{ input: logo, left: Math.round((LADO - meta.width) / 2), top: Math.round((LADO - meta.height) / 2) }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(RAIZ, 'public/images/logo-pergola-plus-florida.png'));
console.log(`  public/images/logo-pergola-plus-florida.png ${LADO}x${LADO}`);
