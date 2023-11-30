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
                    <div className={styles.table_rows} key={index}>
                    <span>{data.sno}</span>
                    <span>{data.token}</span>
                    <span>{data.wallet}</span>
                    <span>{data.deposited}</span>
                    <span>{data.apy}</span>
                    <span>{data.dailyAPY}</span>
                    <span>{data.tvl}</span>
                    {data?.render?data.render(data):
                    <span>{data.actionButton}</span>    
                }
                    </div>
                ))}
            </div>
        </div>
    )
}