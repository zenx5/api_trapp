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

export const currentMonthSales = (req, res)=>baseService(
    'current_month',
    `DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE)`
)(req, res)

export const weekSales = (req, res)=>baseService(
    'week',
    `sales.date >= CURRENT_DATE - INTERVAL '7 days' AND sales.date <= CURRENT_DATE`
)(req, res)

export const lastQuarterSales = (req, res)=>baseService(
    'three_months',
    `DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 month')`
)(req, res)

export const yearSales = (req, res)=>baseService(
    'year',
    `DATE_TRUNC('year', date) = DATE_TRUNC('year', CURRENT_DATE - INTERVAL '1 year')`
)(req, res)


const baseService = (key, where) => (req, res) => {
    const sql = `
    SELECT stores.unique_id, ref_invoice_file_id, store_id, amount_sold, date, stores.name, stores.status
    FROM "Sales_storesale" AS sales
    JOIN "BaseCore_store" AS stores ON (sales.store_id=stores.id)
    WHERE ${where}`
    try{
        query(sql, (data)=>{
            const total = data.reduce((acc, sale)=>{
                const index = acc.findIndex( item => item.store_id === sale.store_id )
                if( index === -1 ) {
                    acc.push({
                        store_id: sale.store_id,
                        unique_id: sale.unique_id,
                        name: sale.name,
                        status: sale.status,
                        total_sold: !isNaN(sale.amount_sold) ? sale.amount_sold : 0
                    })
                } else {
                    acc[index].total_sold += !isNaN(sale.amount_sold) ? sale.amount_sold : 0
                }
                return acc
            },[])
            res.send({
                error:false,
                [key]: total
            })
        })
    } catch( error ) {
        res.send({
            error:true,
            [key]:0
        });
    }
}