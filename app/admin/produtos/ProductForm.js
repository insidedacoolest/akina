import { SHOP_SECTIONS, SHOP_CATEGORIES } from "../../lib/constants";

function variantsToText(json) {
  try {
    return JSON.parse(json || "[]").map((v) => `${v.label},${v.price}`).join("\n");
  } catch {
    return "";
  }
}

export default function ProductForm({ action, initial, submitLabel }) {
  const images = JSON.parse(initial?.imagesJson || "[]");
  const current = initial ? `${initial.section}:${initial.category}` : "merch:vestuario";

  return (
    <form action={action} className="admin-form">
      <fieldset>
        <legend>Básico</legend>
        <label className="field">
          <span>Nome do produto</span>
          <input name="name" required defaultValue={initial?.name} />
        </label>
        <label className="field">
          <span>Secção e categoria</span>
          <select name="sectionCategory" defaultValue={current}>
            {SHOP_SECTIONS.map((s) => (
              <optgroup key={s.value} label={s.long}>
                {SHOP_CATEGORIES[s.value].map((c) => (
                  <option key={c.value} value={`${s.value}:${c.value}`}>{s.label} — {c.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Descrição</span>
          <textarea name="description" rows={4} defaultValue={initial?.description} />
        </label>
      </fieldset>

      <fieldset>
        <legend>Fotos</legend>
        {images.length > 0 && (
          <div className="image-grid">
            {images.map((url) => (
              <label key={url}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" />
                <span className="check"><input type="checkbox" name="removeImages" value={url} /> Remover</span>
              </label>
            ))}
          </div>
        )}
        <input type="file" name="images" accept="image/*" multiple />
        <span className="hint">Podes escolher várias fotos. A primeira é a capa. Proporção recomendada 4:5 (ex. 1200×1500px), até 20MB.</span>
      </fieldset>

      <fieldset>
        <legend>Preço & stock</legend>
        <div className="form-row">
          <label className="field">
            <span>Preço (€)</span>
            <input type="number" step="0.01" min="0" name="price" required defaultValue={initial?.price} />
          </label>
          <label className="field">
            <span>Preço antigo (promoção, opcional)</span>
            <input type="number" step="0.01" min="0" name="oldPrice" defaultValue={initial?.oldPrice ?? ""} />
          </label>
        </div>
        <label className="check"><input type="checkbox" name="inStock" defaultChecked={initial ? initial.inStock : true} /> Em stock (disponível para compra)</label>
        <label className="check"><input type="checkbox" name="featured" defaultChecked={initial?.featured} /> Destacar na página inicial</label>
      </fieldset>

      <fieldset>
        <legend>Tamanhos / variantes</legend>
        <label className="field">
          <span>Tamanhos (mesmo preço, separados por vírgula)</span>
          <input name="sizes" placeholder="S,M,L,XL,2XL" defaultValue={initial?.sizesCsv || ""} />
        </label>
        <label className="field">
          <span>Variantes com preço próprio (uma por linha: Nome,Preço)</span>
          <textarea name="variants" rows={4} placeholder={"Branco,14.90\nHolográfico,19.90"} defaultValue={variantsToText(initial?.variantsJson)} />
          <span className="hint">Se preencheres variantes, substituem os tamanhos na loja.</span>
        </label>
      </fieldset>

      <fieldset>
        <legend>Só para peças</legend>
        <div className="form-row">
          <label className="field">
            <span>Marca</span>
            <input name="brand" defaultValue={initial?.brand} />
          </label>
          <label className="field">
            <span>Referência (SKU)</span>
            <input name="sku" defaultValue={initial?.sku} />
          </label>
        </div>
        <label className="field">
          <span>Compatibilidade</span>
          <input name="fitment" placeholder="ex. Nissan Silvia S13/S14/S15" defaultValue={initial?.fitment} />
        </label>
      </fieldset>

      <div className="form-actions">
        <button type="submit" className="btn btn-red"><span>{submitLabel}</span></button>
      </div>
    </form>
  );
}
