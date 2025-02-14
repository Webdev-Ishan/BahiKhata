const express = require('express')
const app = express();
const path = require('path')
const fs = require('fs')

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/', function(req,res){

fs.readdir('./Files',{withFileTypes:true}, (err, files)=>{

    if(err) res.status(400).send(err.message);
    else{

        res.render('Home.ejs',{files});

    }
})



})

app.get('/create', function(req,res){

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // Ensure two-digit format
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    
    let date = `${day}-${month}-${year}.txt`;

    fs.writeFile(`./Files/${date}`,'Hare ram',(err)=>{

        if(err) res.status(500).send(err.message);

        else{
            res.render('index.ejs');
        }
    })

})



app.get('/edit/:filename', (req,res)=>{


    fs.readFile(`./Files/${req.params.filename}`,"utf-8", (err, data)=>{


        if(err) res.status(500).send(err.message);

        else{


            res.render('edit.ejs', { data, filename: req.params.filename })
        }
    })



})

app.post('/update/:filename', (req,res)=>{

fs.writeFile(`./Files/${req.params.filename}`,req.body.data, (err)=>{

    if(err) res.status(500).send(err.message);
    else{
        res.redirect('/')
    }
})

})



app.get('/show/:filename',(req,res)=>{
    fs.readFile(`./Files/${req.params.filename}`,"utf-8", (err, data)=>{

        if(err) res.status(400).send(err.message);
        else{
    
            res.render('show.ejs',{data, filename:req.params.filename});
    
        }
    })

})

app.get('/delete/:filename', (req,res)=>{

    fs.unlink(`./Files/${req.params.filename}`,(err)=>{

        if(err) res.status(400).send(err.message)

            else{
        
        res.redirect('/')

            }
    })
})

app.listen(3000)