import { bearerToken, jsonPayload } from "../../+internal";
import pipe_handlers from "../../+internal/+pipe_handlers";
import { AuthenticationLevel, InternalConfig } from "../../+internal/+types";

type SearchRequest = {
  query?: string;
  gtin?: string;
  epid?: string;
  filters?: string[];
  sort?: string;
  limit?: number;
};

type SearchResponse = {
  href: string;
  itemSummaries: {
    additionalImages?: {
      width: number;
      height: number;
      imageUrl: string;
    };
    adultOnly: boolean;
    availableCoupons: boolean;
    bidCount?: number;
    buyingOptions: string[];
    categories?: {
      categoryId: string;
    }[];
    compatibilityMatch?: string;
    compatibilityProperties?: {
      localizedName: string;
      name: string;
      value: string;
    }[];
    condition?: string;
    conditionId?: string;
    currentBidPrice?: {
      convertedFromCurrency: string;
      currency: string;
      value: string;
    };
    distanceFromPickupLocation?: {
      unitOfMeasure: string;
      value: string;
    };
    energyEfficiencyClass?: string;
    epid?: string;
    image: {
      height?: number;
      imageUrl: string;
      width?: number;
    };
    itemAffiliateWebUrl?: string;
    itemGroupHref?: string;
    itemGroupType?: string;
    itemHref: string;
    itemId: string;
    itemLocation?: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      country?: string;
      county?: string;
      postalCode?: string;
      stateOrProvince?: string;
    };
    itemWebUrl: string;
    legacyItemId: string;
    marketPricing?: {
      discountAmount?: {
        convertedFromCurrency?: string;
        convertedFromValue?: string;
        currency?: string;
        value?: string;
      };
      discountPercentage?: string;
      originalPrice?: {
        convertedFromCurrency?: string;
        convertedFromValue?: string;
        currency?: string;
        value?: string;
      };
      priceTreatment?: string;
    };
    pickupOptions?: {
      pickupLocationType?: string;
    }[];
    price: {
      convertedFromCurrency?: string;
      convertedFromValue?: string;
      currency?: string;
      value?: string;
    };
    priceDisplayCondition?: string;
    qualifiedPrograms?: string[];
    seller: {
      feedbackPercentage: string;
      feedbackScore: number;
      sellerAccountType?: string;
      username: string;
    };
    shippingOptions?: {
      guaranteedDelivery?: boolean;
      maxEstimatedDeliveryDate?: string;
      minEstimatedDeliveryDate?: string;
      shippingCost?: {
        convertedFromCurrency?: string;
        convertedFromValue?: string;
        currency?: string;
        value?: string;
      };
      shippingCostType: string;
    }[];
    shortDescription?: string;
    thumbnailImages?: {
      height?: number;
      imageUrl: string;
      width?: number;
    }[];
    title: string;
    unitPrice?: {
      convertedFromCurrency?: string;
      convertedFromValue?: string;
      currency?: string;
      value?: string;
    };
    unitPricingMeasure?: string;
  }[];
  limit: number;
  next?: string;
  offset: number;
  prev?: string;
  refinement?: {
    aspectDistributions?: {
      aspectValueDistributions?: {
        localizedAspectValue: string;
        matchCount: number;
        refinementHref: string;
      }[];
      localizedAspectName?: string;
    }[];
    buyingOptionDistributions?: {
      buyingOption: string;
      matchCount: number;
      refinementHref: string;
    }[];
    categoryDistributions?: {
      categoryId: string;
      categoryName: string;
      matchCount: number;
      refinementHref: string;
    }[];
    conditionDistributions?: {
      condition: string;
      conditionId: string;
      matchCount: number;
      refinementHref: string;
      domainCategoryId: string;
    }[];
  };
  total: number;
};

const searchFactory = pipe_handlers(
  [bearerToken(AuthenticationLevel.APPLICATION), jsonPayload()],
  ({ requester }: InternalConfig) => async (request: SearchRequest) => {
    let url = `buy/browse/v1/item_summary/search?`;

    if (request.query) url += `q=${request.query}&`;

    if (request.gtin) url += `gtin=${request.gtin}&`;

    if (request.epid) url += `epid=${request.epid}&`;

    if (request.limit) url += `limit=${request.limit}&`;

    if (request.filters)
      url += `filter=${request.filters.reduce(
        (acc, current, index) => `${acc}${index ? "," : ""}${current}`,
        ""
      )}&`;

    if (request.sort) url += `sort=${request.sort}`;

    const response = await requester({ url, method: "GET" });

    return response.body as SearchResponse;
  }
);

export default searchFactory;
