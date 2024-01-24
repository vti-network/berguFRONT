import React, { useEffect, useState } from 'react';

const truncateString = (inputString, maxLength) => {
    if (inputString.length > maxLength) {
        return inputString.substring(0, maxLength) + '...';
    } else {
        return inputString;
    }
};

const DashboardTable = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchDataAndPopulateTable = async () => {
        try {
            const response = await fetch('http://localhost:8888/api/d');
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (typeof document !== 'undefined') {
            fetchDataAndPopulateTable();
            // Uncomment baris berikut jika ingin me-reload data secara berkala
            const reloadInterval = 60000; // 60 detik
            const intervalId = setInterval(fetchDataAndPopulateTable, reloadInterval);
            return () => clearInterval(intervalId);
        }
    }, []); // Dependency array kosong untuk memastikan efek ini hanya dijalankan sekali pada saat pemasangan komponen

    const filteredData = data.filter(transactionGroup =>
        transactionGroup.transactions.some(transaction =>
            transaction.pengirim.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.penerima.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div>
            <h1>All Transaksi History</h1>
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
                        <th>C</th>
                        <th>Sender</th>
                        <th>Receiver</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(transactionGroup => (
                        transactionGroup.transactions.map((transaction, index) => (
                            <tr key={index}>
                                <td title={transactionGroup.txhash[index]} onMouseEnter={() => truncateString(transaction.penerima, 5)}>
                                    {transactionGroup.txhash[index] ? truncateString(transactionGroup.txhash[index], 5) : ""}
                                </td>
                                <td>{transaction.date_time}</td>
                                <td>{transaction.opt}</td>
                                <td>{transaction.value}</td>
                                <td>{transaction.currency}</td>
                                <td>
                                    <a href={`http://192.168.88.232:3000/${transaction.pengirim}`}>
                                        {truncateString(transaction.pengirim, 5)}
                                    </a>
                                </td>
                                <td>
                                    <a href={`http://192.168.88.232:3000/${transaction.penerima}`}>
                                        {truncateString(transaction.penerima, 5)}
                                    </a>
                                </td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardTable;
