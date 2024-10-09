import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { Buffer } from 'buffer';

export async function POST(req) {
  const body = await req.json();

  const { prompt, output_format, quality } = body;

  if (!prompt || !output_format) {
    return NextResponse.json({ message: 'Missing required fields: prompt and output_format' }, { status: 400 });
  }

  // Create form data for the request payload
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('output_format', output_format);
  
  // Adjusting image quality to save credits (lower steps, resolution, etc.)
  const modelParams = {
    steps: quality?.steps || 2, // Lower steps for lower quality
    resolution: quality?.resolution || '512x512', // Lower resolution for less credits
  };

  formData.append('steps', modelParams.steps);
  formData.append('resolution', modelParams.resolution);

  try {
    // Fetch the image from the external API
    const response = await fetch(`https://api.stability.ai/v2beta/stable-image/generate/core`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer sk-p4SeIpCL0NAdW8uq2Vp9T7vdHWW5KILoE3Dv4LdgHzr5G6TV`, // Replace sk-MYAPIKEY with your actual key
        Accept: 'image/*',
      },
      body: formData,
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();

      // Alternatively, send the image directly as a response to the client
      return new Response(Buffer.from(buffer), {
        status: 200,
        headers: {
          'Content-Type': 'image/webp',
        },
      });
    } else {
      const errorData = await response.text();
      return NextResponse.json({ message: errorData }, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}