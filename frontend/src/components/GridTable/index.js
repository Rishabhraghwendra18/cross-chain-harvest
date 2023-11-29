import styles from "./index.module.css";

export default function GridTable({tableHeading=[],tableData=[]}) {
    return(
        <div className={styles.grid_table_container}>
            <div className={styles.table_heading}>
                {
                    tableHeading.map((heading,index)=>(
                        <span key={index}>{heading.label}</span>
                    ))
                }
            </div>
            <div>
                {tableData?.map((data,index)=>(
                    <div className={styles.table_rows}>
                    <span key={index}>{data.sno}</span>
                    <span key={index}>{data.token}</span>
                    <span key={index}>{data.wallet}</span>
                    <span key={index}>{data.deposited}</span>
                    <span key={index}>{data.apy}</span>
                    <span key={index}>{data.dailyAPY}</span>
                    <span key={index}>{data.tvl}</span>
                    <span key={index}>{data?.render?data.render():data.actionButton}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}