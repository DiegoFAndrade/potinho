import {
  initConnection,
  endConnection,
  fetchProducts,
  requestPurchase,
  getAvailablePurchases,
} from 'react-native-iap';
import { useAppStore } from '@/stores/appStore';

export const PREMIUM_SKU = 'premium_unlock';

interface Product {
  id: string;
  displayPrice?: string;
  title?: string;
}

export const purchaseService = {
  init: async () => {
    try {
      await initConnection();
      // Restore any past purchases silently at startup
      const past: any = await getAvailablePurchases({ onlyIncludeActiveItemsIOS: true } as any);
      if (Array.isArray(past) && past.some((p: any) => p?.productId === PREMIUM_SKU)) {
        useAppStore.getState().setPremium(true);
      }
    } catch {
      // Offline or IAP unavailable — do nothing. User stays free-tier.
    }
  },
  cleanup: async () => {
    try {
      await endConnection();
    } catch {
      // ignore
    }
  },
  getPremiumProduct: async (): Promise<Product | null> => {
    try {
      const products: any = await fetchProducts({ skus: [PREMIUM_SKU], type: 'inapp' } as any);
      if (Array.isArray(products) && products.length > 0) {
        const p = products[0];
        return { id: p.id ?? p.productId ?? PREMIUM_SKU, displayPrice: p.displayPrice ?? p.localizedPrice, title: p.title };
      }
      return null;
    } catch {
      return null;
    }
  },
  buyPremium: async (): Promise<{ ok: boolean; error?: string }> => {
    try {
      await requestPurchase({ request: { skus: [PREMIUM_SKU] }, type: 'inapp' } as any);
      useAppStore.getState().setPremium(true);
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? 'Compra falhou' };
    }
  },
  restore: async (): Promise<boolean> => {
    try {
      const past: any = await getAvailablePurchases({} as any);
      const has = Array.isArray(past) && past.some((p: any) => p?.productId === PREMIUM_SKU);
      if (has) useAppStore.getState().setPremium(true);
      return has;
    } catch {
      return false;
    }
  },
};
