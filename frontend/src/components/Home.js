import React, { useEffect, useState } from 'react'
import axios from 'axios'


function Home() {
  
  const [data, setData] = useState([])

  useEffect(() =>{
    const fetchPlayers = async () => {
        const res = await axios.get(`http://localhost:5000/`);
        setData(res.data);
    }
    fetchPlayers();
    
  }, [])

  return (
    <div className="Home">
        <table>
            <tbody>
            {data.map((item, index) => {
                return(
                    <tr key={index}>
                        <td><a href={`/tournament/${item.name}`}>{item.name}</a></td>
                    </tr>
                )
            })}  
            </tbody>
        </table>  
    </div>
  );
}

export default Home;
