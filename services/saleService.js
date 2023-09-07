import query from "../databasepg.js";

export const generalSales = (req, res) => {
    try{
        query(`
        SELECT id, ref_invoice_file_id, store_id, amount_sold, date
        FROM "Sales_storesale"
        WHERE DATE_PART('year', date) = DATE_PART('year', CURRENT_DATE)
        `, (data)=>{
            let total_week = data.reduce((acc, sale)=>{
                const fechaActual = new Date();
                const inicioSemana = new Date(fechaActual);
                inicioSemana.setDate(fechaActual.getDate() - fechaActual.getDay());
                const finSemana = new Date(fechaActual);
                finSemana.setDate(fechaActual.getDate() - fechaActual.getDay() + 6);
                if( !isNaN(sale.amount_sold) && (sale.date >= inicioSemana && sale.date <= finSemana) ) return acc + sale.amount_sold
                return acc
            },0)
            let total_current_sales = data.reduce((acc, sale)=>{
                // const current_month = new Date().getMonth()
                // const month = sale.date.getMonth() + 1
                // if( !isNaN(sale.amount_sold) && (current_month==month) ) return acc + sale.amount_sold
                const fechaActual = new Date();
                const inicioSemana = new Date(fechaActual);
                inicioSemana.setDate(1);
                const finSemana = new Date(fechaActual);
                finSemana.setDate(fechaActual.getDate());
                if( !isNaN(sale.amount_sold) && (sale.date >= inicioSemana && sale.date <= finSemana) ) return acc + sale.amount_sold
                return acc
            },0)
            let total_three_months = data.reduce((acc, sale)=>{
                const current_month = new Date().getMonth() - 2
                const month = sale.date.getMonth() + 1
                if( !isNaN(sale.amount_sold) && (current_month <= month) ) return acc + sale.amount_sold
                return acc
            },0)
            let total_year = data.reduce((acc, sale)=>{
                if( !isNaN(sale.amount_sold) ) return acc + sale.amount_sold
                return acc
            },0)

            res.send({
                total_week,
                total_current_sales,
                total_year,
                total_three_months,
            })
        })
    } catch( error ) {
        res.send({
            total_week: 0,
            total_current_sales: 0,
            total_year: 0,
            total_three_months: 0,
            error: true
        })
    }
}

export const currentMonthSales = (req, res) => {
    const sql = `
    SELECT ref_invoice_file_id, store_id, amount_sold, date, stores.name
    FROM "Sales_storesale" AS sales
    JOIN "BaseCore_store" AS stores ON (sales.store_id=stores.id)
    WHERE DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE)`
    try{
        query(sql, (data)=>{
            const current_month = data.reduce((acc, sale)=>{
                const index = acc.findIndex( item => item.store_id === sale.store_id )
                if( index === -1 ) {
                    acc.push({
                        store_id: sale.store_id,
                        name: sale.name,
                        total_sold: !isNaN(sale.amount_sold) ? sale.amount_sold : 0
                    })
                } else {
                    acc[index].total_sold += !isNaN(sale.amount_sold) ? sale.amount_sold : 0
                }
                return acc
            },[])
            res.send({
                current_month
            })
        })
    } catch( error ) {
        res.send('weekSales with error: ' + error.message);
    }
    // res.send('currentMonthSales');
}

export const weekSales = (req, res) => {
    const sql = `
    SELECT ref_invoice_file_id, store_id, amount_sold, date, stores.name
    FROM "Sales_storesale" AS sales
    JOIN "BaseCore_store" AS stores ON (sales.store_id = stores.id)
    WHERE sales.date >= CURRENT_DATE - INTERVAL '7 days'
    AND sales.date <= CURRENT_DATE;`

    try{
        query(sql, (data)=>{
            const week = data.reduce((acc, sale)=>{
                const index = acc.findIndex( item => item.store_id === sale.store_id )
                if( index === -1 ) {
                    acc.push({
                        store_id: sale.store_id,
                        name: sale.name,
                        total_sold: !isNaN(sale.amount_sold) ? sale.amount_sold : 0
                    })
                } else {
                    acc[index].total_sold += !isNaN(sale.amount_sold) ? sale.amount_sold : 0
                }
                return acc
            },[])
            res.send({
                week
            })
        })
    } catch( error ) {
        res.send('yearSales with error: ' + error.message);
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

export const lastQuarterSales = (req, res) => {
    const sql = `
    SELECT ref_invoice_file_id, store_id, amount_sold, date, stores.name
    FROM "Sales_storesale" AS sales
    JOIN "BaseCore_store" AS stores ON (sales.store_id=stores.id)
    WHERE DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 month')
    `
    try{
        query(sql, (data)=>{
            const three_months = data.reduce((acc, sale)=>{
                const index = acc.findIndex( item => item.store_id === sale.store_id )
                if( index === -1 ) {
                    acc.push({
                        store_id: sale.store_id,
                        name: sale.name,
                        total_sold: !isNaN(sale.amount_sold) ? sale.amount_sold : 0
                    })
                } else {
                    acc[index].total_sold += !isNaN(sale.amount_sold) ? sale.amount_sold : 0
                }
                return acc
            },[])
            res.send({
                three_months
            })
        })
    } catch( error ) {
        res.send('quarterSales with error: ' + error.message);
    }
}

export const yearSales = (req, res) => {
    const sql = `
    SELECT ref_invoice_file_id, store_id, amount_sold, date, stores.name
    FROM "Sales_storesale" AS sales
    JOIN "BaseCore_store" AS stores ON (sales.store_id=stores.id)
    WHERE DATE_TRUNC('year', date) = DATE_TRUNC('year', CURRENT_DATE - INTERVAL '1 year')`
    try{
        query(sql, (data)=>{
            const year = data.reduce((acc, sale)=>{
                const index = acc.findIndex( item => item.store_id === sale.store_id )
                if( index === -1 ) {
                    acc.push({
                        store_id: sale.store_id,
                        name: sale.name,
                        total_sold: !isNaN(sale.amount_sold) ? sale.amount_sold : 0
                    })
                } else {
                    acc[index].total_sold += !isNaN(sale.amount_sold) ? sale.amount_sold : 0
                }
                return acc
            },[])
            res.send({
                year
            })
        })
    } catch( error ) {
        res.send('yearSales with error: ' + error.message);
    }
}