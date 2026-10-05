import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { uploadImages, updateImage, deleteImage } from "./actions";
import { ConfirmButton } from "../ui";

export const metadata = { title: "Galeria — Painel Akina" };

export default async function GaleriaPage() {
  await requireAdmin();
  const images = await prisma.galleryImage.findMany({ orderBy: [{ order: "asc" }, { id: "desc" }] });
  return (
    <>
      <div className="admin-head"><div><h1>Galeria</h1><p>Fotos da secção Galeria na página Drift. As fotos aparecem a preto e vermelho e ganham cor ao passar o rato.</p></div></div>

      <form action={uploadImages} className="admin-form" style={{ marginBottom: "2.5rem" }}>
        <fieldset>
          <legend>Carregar fotos</legend>
          <input type="file" name="images" accept="image/*" multiple required />
          <label className="field"><span>Legenda (opcional, aplica-se a todas)</span><input name="caption" placeholder="ex. Lagoa Motorshow 2026" /></label>
          <div className="form-actions"><button className="btn btn-red btn-sm"><span>Carregar</span></button></div>
        </fieldset>
      </form>

      <div className="gallery-admin">
        {images.map((g) => (
          <figure key={g.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.imageUrl} alt={g.caption} />
            <figcaption>
              <form action={updateImage.bind(null, g.id)} className="form" style={{ gap: ".4rem" }}>
                <input name="caption" defaultValue={g.caption} placeholder="Legenda" className="field" style={{ background: "var(--bg)", border: "1px solid var(--line-2)", padding: ".4rem .5rem" }} />
                <div style={{ display: "flex", gap: ".4rem" }}>
                  <input name="order" type="number" defaultValue={g.order} title="Ordem" style={{ width: 60, background: "var(--bg)", border: "1px solid var(--line-2)", padding: ".4rem .5rem" }} />
                  <button className="link-btn">Guardar</button>
                </div>
              </form>
              <form action={deleteImage.bind(null, g.id)}><ConfirmButton className="link-btn danger-btn" message="Apagar esta foto?">Apagar</ConfirmButton></form>
            </figcaption>
          </figure>
        ))}
        {images.length === 0 && <p className="hint">Ainda não há fotos — a galeria mostra imagens de exemplo até carregares as primeiras.</p>}
      </div>
    </>
  );
}
