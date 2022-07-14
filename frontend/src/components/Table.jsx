import React, { useState, useEffect } from 'react';
import {Button} from "@material-ui/core";

const Table = props =>{

    const [arr, setArr] = useState([]);
    let data = Array.from(props.data);

    useEffect(() => {
        props.setArrayOfPlayers(arr);
    }, [arr, props])


    return (
        <table>
            <tbody>
                <tr>
                    <th>Name</th>
                    <th>Federation</th>
                    <th>Sex</th>
                    <th>Standard Elo</th>
                    <th>Rapid Elo</th>
                    <th>Blitz Elo</th>
                </tr>
                {data.map((item, index) =>(
                    <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.federation}</td>
                        <td>{item.sex}</td>
                        <td>{item.standardElo}</td>
                        <td>{item.rapidElo}</td>
                        <td>{item.blitzElo}</td>
                        <td><Button variant="contained" disabled={arr.includes(item._id)} onClick={() => {
                            setArr([...arr, item._id]);
                            }}>Add</Button></td>
                        <td><Button variant="contained" disabled={!arr.includes(item._id)} onClick={() => {
                            var index = arr.indexOf(item._id)
                            setArr([...arr.slice(0, index), ...arr.slice(index + 1)])
                        }}>Delete</Button></td>
                        
                    </tr>
                ))}
            </tbody>
        </table>
    )
};

export default Table;