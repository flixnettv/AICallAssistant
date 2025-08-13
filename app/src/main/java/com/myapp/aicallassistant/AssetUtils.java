package com.myapp.aicallassistant;

import android.content.Context;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class AssetUtils {
    public static String syncAssetDir(Context context, String assetDir) throws IOException {
        File outDir = new File(context.getFilesDir(), assetDir);
        if (!outDir.exists()) {
            if (!outDir.mkdirs()) throw new IOException("Failed to create dir: " + outDir);
        }
        String[] files = context.getAssets().list(assetDir);
        if (files == null) return outDir.getAbsolutePath();
        for (String name : files) {
            String assetPath = assetDir + "/" + name;
            String[] nested = context.getAssets().list(assetPath);
            if (nested != null && nested.length > 0) {
                syncAssetDir(context, assetPath);
            } else {
                copyAssetFile(context, assetPath, new File(outDir, name));
            }
        }
        return outDir.getAbsolutePath();
    }

    private static void copyAssetFile(Context context, String assetPath, File dst) throws IOException {
        if (dst.exists() && dst.length() > 0) return;
        File parent = dst.getParentFile();
        if (parent != null && !parent.exists()) parent.mkdirs();
        try (InputStream in = context.getAssets().open(assetPath);
             FileOutputStream out = new FileOutputStream(dst)) {
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
        }
    }
}