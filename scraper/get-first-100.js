const { readFile, appendFile } = require('fs').promises
const axios = require('axios')

let idArray = []

const start = async () => {
    try {
        const idArray = [await readFile('./first-100-id.txt', 'utf8')][0].split(',')

        await appendFile('./first-100-data.json','{ \n "Players": [ \n',{ 
            encoding: "utf8",
            flag: "a+",
            mode: 0o666
          }, (err, res) => {
            if(err){
                console.log(err)
                return
            }
        })
        for await (const element of idArray){
            
            await axios.get(`https://fide-ratings-scraper.herokuapp.com/player/${element}/info`)
                        .then(res => {
                            appendFile('./first-100-data.json', JSON.stringify(res.data) + ", \n",{
                                encoding: "utf8",
                                flag: "a+",
                                mode: 0o666
                              }, (err, res) => {
                                if(err){
                                    console.log(err)
                                    return
                                }
                            })
                        })
                        .catch(error => {
                            console.error(error)
                        })
        }

        await appendFile('./first-100-data.json','] \n }',{ 
            encoding: "utf8",
            flag: "a+",
            mode: 0o666
          }, (err, res) => {
            if(err){
                console.log(err)
                return
            }
        })
        
    } catch (error){
        console.log(error)
    }
}
start()


