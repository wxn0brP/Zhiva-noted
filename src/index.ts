import { apiRouter } from "@wxn0brp/zhiva-base-lib/api";
import { app, oneWindow } from "@wxn0brp/zhiva-base-lib/server";
import { Valthera } from "@wxn0brp/db";

app.static("public");
app.static("dist");

const db = new Valthera("data");

apiRouter.get("/notes", async (req, res) => {
    return await db.find("notes");
});

apiRouter.post("/notes", async (req, res) => {
    const { title, content } = req.body;
    if (!title) return { err: true, msg: "Missing title" };
    if (!content) return { err: true, msg: "Missing content" };

    const { _id } = await db.add("notes", {
        title,
        content,
    });
    return { err: false, _id };
});

apiRouter.put("/notes", async (req) => {
    const { _id, title, content } = req.body;
    if (!_id) return { err: true, msg: "Missing id" };

    const updated = await db.updateOne("notes", { _id }, { title, content });
    return { err: false, updated };
});

apiRouter.delete("/notes", async (req) => {
    const { _id } = req.body;
    if (!_id) return { err: true, msg: "Missing id" };

    const removed = await db.removeOne("notes", { _id });
    return { err: false, removed };
});

oneWindow();