package com.myapp.aicallassistant;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

public class WavUtils {
    public static byte[] pcmToWav(byte[] pcm, int sampleRate, int channels, int bitsPerSample) throws IOException {
        int byteRate = sampleRate * channels * bitsPerSample / 8;
        int dataSize = pcm.length;
        int chunkSize = 36 + dataSize;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        out.write("RIFF".getBytes());
        out.write(intToLittleEndian(chunkSize));
        out.write("WAVE".getBytes());
        out.write("fmt ".getBytes());
        out.write(intToLittleEndian(16)); // Subchunk1Size for PCM
        out.write(shortToLittleEndian((short) 1)); // PCM
        out.write(shortToLittleEndian((short) channels));
        out.write(intToLittleEndian(sampleRate));
        out.write(intToLittleEndian(byteRate));
        out.write(shortToLittleEndian((short) (channels * bitsPerSample / 8))); // Block align
        out.write(shortToLittleEndian((short) bitsPerSample));
        out.write("data".getBytes());
        out.write(intToLittleEndian(dataSize));
        out.write(pcm);
        return out.toByteArray();
    }

    private static byte[] intToLittleEndian(int value) {
        return ByteBuffer.allocate(4).order(ByteOrder.LITTLE_ENDIAN).putInt(value).array();
    }

    private static byte[] shortToLittleEndian(short value) {
        return ByteBuffer.allocate(2).order(ByteOrder.LITTLE_ENDIAN).putShort(value).array();
    }
}