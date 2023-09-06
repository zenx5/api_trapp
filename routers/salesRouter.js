// https://api.trodapp.com/api/admin/sales/

import { Router } from "express";
import { currentMonthSales, generalSales, quarterSales, weekSales, yearSales } from "../services/serviceRouter.js";

const salesRouter = Router();

salesRouter.get("/general", generalSales);
salesRouter.get("/current_month", currentMonthSales);
salesRouter.get("/week", weekSales);
salesRouter.get("/three_months", quarterSales );
salesRouter.get("/year", yearSales);

export default salesRouter;

