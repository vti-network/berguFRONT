import React, { useEffect, useState } from 'react';

const truncateString = (inputString, maxLength) => {
    if (inputString.length > maxLength) {
        return inputString.substring(0, maxLength) + '...';
    } else {
        return inputString;
    }
};

const PublicTable = ({ hashaddress }) => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchDataAndPopulateTable = () => {
        fetch(`http://localhost:8888/api/d/${hashaddress}`)
            .then(response => response.json())
            .then(data => {
                setData(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    useEffect(() => {
        if (typeof document !== 'undefined') {
            fetchDataAndPopulateTable();
            // Uncomment baris berikut jika ingin me-reload data secara berkala
            const reloadInterval = 60000; // 60 detik
            const intervalId = setInterval(fetchDataAndPopulateTable, reloadInterval);
            return () => clearInterval(intervalId);
        }
    }, [fetchDataAndPopulateTable, hashaddress]); // Dependency array kosong untuk memastikan efek ini hanya dijalankan sekali pada saat pemasangan komponen

    const filteredData = data.filter(transactionGroup =>
        transactionGroup.transactions.some(transaction =>
            transaction.pengirim.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.penerima.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div>
            <h1>{ hashaddress }</h1>
            <strong>Balance:</strong>
            {data.map((transactionGroup, groupIndex) => (
                <span key={groupIndex}>
                    {transactionGroup.balance.map((balance, balanceIndex) => (
                        <span key={balanceIndex}>
                            {Object.entries(balance).map(([currency, amount]) => (
                                <span key={currency}>
                                    {`${currency}: ${amount} `}
                                </span>
                            ))}
                        </span>
                    ))}
                </span>
            ))}
            <input
                type="text"
                placeholder="sender / receiver"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <table id='transactionTable'>
                <thead>
                    <tr>
                        <th>txhash</th>
                        <th>date time</th>
                        <th>Opt</th>
                        <th>Value</th>
                        <th>Currency</th>
                        <th>Sender</th>
                        <th>Receiver</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((transactionGroup, groupIndex) => (
                        <React.Fragment key={groupIndex}>
                            {transactionGroup.transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td title={transactionGroup.txhash[index]} onMouseEnter={() => truncateString(transaction.penerima, 5)}>
                                        {transactionGroup.txhash[index] ? truncateString(transactionGroup.txhash[index], 5) : ""}
                                    </td>
                                    <td>{transaction.date_time}</td>
                                    <td>{transaction.opt}</td>
                                    <td>{transaction.value}</td>
                                    <td>{transaction.currency}</td>
                                    <td>
                                        <a href={`http://localhost:3000/${transaction.pengirim}`}>
                                            {truncateString(transaction.pengirim, 5)}
                                        </a>
                                    </td>
                                    <td>
                                        <a href={`http://localhost:3000/${transaction.penerima}`}>
                                            {truncateString(transaction.penerima, 5)}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PublicTable;
