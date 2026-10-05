import Link from "next/link";
import Media from "./Media";
import { productGlyph } from "./Icon";
import { eur } from "../lib/format";
import { categoryLabel } from "../lib/constants";

export default function ProductCard({ product }) {
  const onSale = product.oldPrice && product.oldPrice > product.price;
  return (
    <Link href={`/loja/${product.id}`} className={`product-card${product.inStock ? "" : " sold-out"}`}>
      <div className="product-card-media">
        <Media src={product.images?.[0]} alt={product.name} icon={productGlyph(product)} ratio="4 / 5" />
        <div className="product-badges">
          {onSale && <span className="badge badge-red">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>}
          {!product.inStock && <span className="badge badge-dark">Esgotado</span>}
        </div>
        <span className="product-card-go" aria-hidden="true">Ver →</span>
      </div>
      <div className="product-card-body">
        <span className="product-card-cat">
          {product.brand ? `${product.brand} · ` : ""}{categoryLabel(product.section, product.category)}
        </span>
        <h3>{product.name}</h3>
        <div className="product-card-price">
          {onSale && <s>{eur(product.oldPrice)}</s>}
          <b>{eur(product.price)}</b>
        </div>
      </div>
    </Link>
  );
}
