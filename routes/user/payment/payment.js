import { Router } from "express";
const router = Router();
import { singleById, update } from "../../model/key.model";
import toFunc from "../../util/toFunction";

const getInfoApiKey = async (req, res) => {
  const id = req.params.id;
  const key = await toFunc(singleById(id));
  if (key[0]) {
    return { error: key[0] };
  }
  const data = key[1][0];
  const path = `/img/${data.price}.png`;
  return { error: null, data, path };
};
router.get("/:id", async (req, res, next) => {
  const { data, path, error } = getInfoApiKey(req, res, next);
  if (error) return next(result.error);
  res.render("/payment/payment", {
    price: data.price,
    imgSrc: path
  });
});
router.post("/:id", async (req, res, next) => {
  const transactionId = req.body.transactionId || "";
  const { data, path, error } = await getInfoApiKey(req, res, next);
  console.log("dataa----", error, data);
  if (error) return next(result.error);
  if (data.transactionId === transactionId) {
    data.valid = true;
    data.transactionId = null;
    update("api_key", "id", data);
    return res.redirect("/profile");
  }
  res.render("/payment/payment", {
    price: data.price,
    imgSrc: path,
    message: "Mã giao dịch không khớp !!!!"
  });
});

export default router;
