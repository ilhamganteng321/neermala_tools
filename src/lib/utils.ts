import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// lib/utils.ts
export const formatDate = (dateString: string) => {
  if (!dateString) return "Coming Soon";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getStatusColor = (status: "paid" | "unpaid") => {
  return status === "paid"
    ? "bg-green-100 text-green-700 border-green-200"
    : "bg-red-100 text-red-700 border-red-200";
};

export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(ev.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// src/lib/utils.ts

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const downloadAsPng = async (
  elementId: string,
  filename: string = "funfact.png",
) => {
  const { toPng } = await import("html-to-image");
  const originalElement = document.getElementById(elementId);
  if (!originalElement) return;

  try {
    // Clone element untuk di-capture tanpa scroll
    const cloneContainer = document.createElement('div');
    cloneContainer.style.position = 'absolute';
    cloneContainer.style.top = '-9999px';
    cloneContainer.style.left = '-9999px';
    cloneContainer.style.width = `${originalElement.offsetWidth}px`;
    document.body.appendChild(cloneContainer);
    
    // Clone konten
    const clone = originalElement.cloneNode(true) as HTMLElement;
    
    // Hilangkan scroll di clone
    const scrollElements = clone.querySelectorAll('[class*="overflow-y-auto"], [style*="overflow-y"]');
    scrollElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.overflow = 'visible';
        el.style.maxHeight = 'none';
        el.style.height = 'auto';
      }
    });
    
    // Set ukuran clone
    clone.style.width = `${originalElement.offsetWidth}px`;
    clone.style.margin = '0';
    clone.style.padding = '0';
    
    cloneContainer.appendChild(clone);
    
    // Capture clone
    const dataUrl = await toPng(cloneContainer, { 
      quality: 1, 
      pixelRatio: 2,
      backgroundColor: '#ffffff'
    });
    
    // Cleanup
    document.body.removeChild(cloneContainer);
    
    // Download
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Failed to download image:", error);
  }
};