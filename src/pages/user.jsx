import React, { useState, useEffect } from 'react';
import '../component/css/User.css';
import MyHeader from '../component/header';

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

async function sendTransaction(alamat, secretKey, currency, jumlah, alamatTujuan) {
  try {
    const response = await fetch(`http://localhost:8888/api/s/${alamat}/${secretKey}/${currency}/${jumlah}/${alamatTujuan}`);
    const responseData = await response.json();

    if (response.ok && responseData.success) {
      return responseData.message;
    } else {
      console.error('Format respons tidak sesuai:', responseData);
      return 'kirim gagal';
    }
  } catch (error) {
    console.error('Error saat kirim:', error);
    return 'kirim gagal';
  }
}

function Duser() {
  const [alamat, setAlamat] = useState(null);
  const [secretKey, setSecretKey] = useState(null);

  useEffect(() => {
    const infoAddress = localStorage.getItem('alamat');
    const infoKey = localStorage.getItem('secretKey');

    if (infoAddress) {
      setAlamat(infoAddress);
    }
    if (infoKey) {
      setSecretKey(infoKey);
    }
  }, []);

  return (
    <div className='content'>
      <MyHeader />
      ini dashboard user
      <div className='tconntainer'>
        <Opt alamat={alamat} secretKey={secretKey} />
      </div>
    </div>
  );
}

function Opt({ alamat, secretKey }) {
  const [alamatTujuan, setAlamatTujuan] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [currency, setMatauang] = useState('');
  const [pesan, setPesan] = useState('');

  //
  const [userCollapsed, setUserCollapsed] = useState(true);
  const [kirimCollapsed, setKirimCollapsed] = useState(false);
  const [convertCollapsed, setConvertCollapsed] = useState(false);
  const [hsCollapsed, setHsCollapsed] = useState(false);

  const toggleCollapse = (collapseFunction) => {
    // Menutup semua elemen yang dapat di-collapse
    setUserCollapsed(false);
    setKirimCollapsed(false);
    setConvertCollapsed(false);
    setHsCollapsed(false);

    // Membuka atau menutup elemen yang diklik
    collapseFunction((prev) => !prev);
  };

  //kirim
  const kirim = async () => {
    const message = await sendTransaction(alamat, secretKey, currency, jumlah, alamatTujuan);
    setPesan(message);
  };

  return (
    <div>
      <nav>
        <ul>
          <button onClick={() => toggleCollapse(setUserCollapsed)} className='buser'>
            user
          </button>
        </ul>

        <ul>
          <button onClick={() => toggleCollapse(setKirimCollapsed)} className='buser'>
            kirim
          </button>
        </ul>

        <ul>
          <button onClick={() => toggleCollapse(setConvertCollapsed)} className='buser'>
            convert
          </button>
        </ul>

        <ul>
          <button onClick={() => toggleCollapse(setHsCollapsed)} className='buser'>
            History
          </button>
        </ul>
      </nav>

      <div className='section'>
        {userCollapsed && (
          <div className='section'>
            <Baluser alamat={alamat} />
          </div>
        )}

        {kirimCollapsed && (
          <div className='section'>
            <label>{pesan}</label>
            <br />
            <input
              type='text'
              value={alamatTujuan}
              placeholder='alamat penerima'
              required
              onChange={(e) => setAlamatTujuan(e.target.value)}
            />
            <br />
            <input
              type='text'
              value={jumlah}
              placeholder='jumlah'
              required
              onChange={(e) => setJumlah(e.target.value)}
            />
            <br />
            <input
              type='text'
              value={currency}
              placeholder='IDR OR BTKN'
              required
              onChange={(e) => setMatauang(e.target.value)}
            />
            <br />
            <button onClick={kirim}>send</button>
          </div>
        )}

        {convertCollapsed && (
          <div className='section'>convert</div>
        )}

        {hsCollapsed && (
          <div className='section'>
            <UserTable alamat={alamat} />
          </div>
        )}
      </div>
    </div>
  );
}

// usertable
const truncateString = (inputString, maxLength) => {
  if (inputString.length > maxLength) {
    return inputString.substring(0, maxLength) + '...';
  } else {
    return inputString;
  }
};

// ...

const Baluser = ({ alamat }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDataAndPopulateTable = async () => {
      try {
        const data = await fetchData(`http://localhost:8888/api/d/${alamat}`);
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (typeof document !== 'undefined') {
      fetchDataAndPopulateTable();
      // Uncomment baris berikut jika ingin me-reload data secara berkala
      const reloadInterval = 60000; // 60 detik
      const intervalId = setInterval(fetchDataAndPopulateTable, reloadInterval);
      return () => clearInterval(intervalId);
    }
  }, [alamat]); // alamat is the only dependency now

  return (
    <div>
      <strong>{alamat}</strong>
      <br />
      <strong>Balance:</strong>
      {data.map((transactionGroup, groupIndex) => (
        <span key={groupIndex}>
          {transactionGroup.balance.map((balance, balanceIndex) => (
            <span key={balanceIndex}>
              {Object.entries(balance).map(([currency, amount]) => (
                <span key={currency}>{`${currency}: ${amount} `}</span>
              ))}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
};

// ...

const UserTable = ({ alamat }) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDataAndPopulateTable = async () => {
    try {
      const data = await fetchData(`http://localhost:8888/api/d/${alamat}`);
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
  }, [alamat]); // Dependency array kosong untuk memastikan efek ini hanya dijalankan sekali pada saat pemasangan komponen

  const filteredData = data.filter((transactionGroup) =>
    transactionGroup.transactions.some(
      (transaction) =>
        transaction.pengirim.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.penerima.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div>
      <input
        type='text'
        placeholder='sender / receiver'
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
                  <td
                    title={transactionGroup.txhash[index]}
                    onMouseEnter={() => truncateString(transaction.penerima, 5)}
                  >
                    {transactionGroup.txhash[index]
                      ? truncateString(transactionGroup.txhash[index], 5)
                      : ''}
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
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
// usertable
export default Duser;
