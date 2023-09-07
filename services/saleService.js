import query from "../databasepg.js";

export const generalSales = (req, res) => {
    try{
        query('SELECT * FROM "Sales_storesale" LIMIT 10', (data)=>res.send(data))
    } catch( error ) {
        res.send('generalSales with error: ' + error.message);
    }
}

export const currentMonthSales = (req, res) => {
    const sql = `
    SELECT
        EXTRACT(YEAR FROM date) AS año,
        EXTRACT(MONTH FROM date) AS mes,
        SUM(amount_sold) AS ventas_mensuales
    FROM
        "Sales_storesale"
    GROUP BY
        año, mes
    ORDER BY
        año, mes;`
    try{
        query(sql, (data)=>res.send(data))
    } catch( error ) {
        res.send('weekSales with error: ' + error.message);
    }
    // res.send('currentMonthSales');
}

export const weekSales = (req, res) => {
    const sql = `
    SELECT
        to_char(date_trunc('week', date), 'IYYY-IW') AS semana,
        jsonb_agg(jsonb_build_object(
            'id', id,
            'amount_sold', amount_sold,
            'date', date
        )) AS ventas_semana
    FROM
        "Sales_storesale"
    GROUP BY
        semana
    ORDER BY
        semana;`
    try{
        query(sql, (data)=>res.send(data))
    } catch( error ) {
        res.send('weekSales with error: ' + error.message);
    }
}

export const quarterSales = (req, res) => {
    const sql = `
    SELECT
        EXTRACT(YEAR FROM date) AS año,
        CASE
            WHEN EXTRACT(MONTH FROM date) BETWEEN 1 AND 3 THEN 'Q1'
            WHEN EXTRACT(MONTH FROM date) BETWEEN 4 AND 6 THEN 'Q2'
            WHEN EXTRACT(MONTH FROM date) BETWEEN 7 AND 9 THEN 'Q3'
            WHEN EXTRACT(MONTH FROM date) BETWEEN 10 AND 12 THEN 'Q4'
        END AS trimestre,
        SUM(amount_sold) AS ventas_trimestrales
    FROM
        "Sales_storesale"
    GROUP BY
        año, trimestre
    ORDER BY
        año, trimestre;`
    try{
        query(sql, (data)=>res.send(data))
    } catch( error ) {
        res.send('quarterSales with error: ' + error.message);
    }
}

export const yearSales = (req, res) => {
    const sql = `
    SELECT
        EXTRACT(YEAR FROM date) AS año,
        SUM(amount_sold) AS ventas_anuales
    FROM
        "Sales_storesale"
    GROUP BY
        año
    ORDER BY
        año;`
    try{
        query(sql, (data)=>res.send(data))
    } catch( error ) {
        res.send('yearSales with error: ' + error.message);
    }
}