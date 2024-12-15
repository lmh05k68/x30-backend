import paypal from "paypal-rest-sdk";

paypal.configure({
  mode: "sandbox",
  client_id: "AapQFVkSNP7eOPqcXqAzNwuwGiY_aluTDnBK8hpxb3bGxhQnRLZKaAh_uVnrxQSYnJ53ovLPG-qDta88", 
  client_secret: "EMJhRWE7RIVsMxMYr74JQXTbPKIo426X8S9EjPXHiUI0fE9uFSa7fbxAUtVQjv_nBip512zOMU_mJUiE", 
});

export default paypal;