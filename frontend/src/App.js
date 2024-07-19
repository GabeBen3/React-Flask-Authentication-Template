// Filename - App.js
 
// Importing modules
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import "./App.css";
import HomeScreen from './components/testing/HomeScreen';

function App() {
    // usestate for setting a javascript
    // object for storing and using data
    // const [data, setdata] = useState({
    //     name: "Gab",
    //     age: 0,
    //     date: "today",
    //     programming: "yes",
    // });
 
    // // Using useEffect for single rendering
    // useEffect(() => {
    //     // Using fetch to fetch the api from 
    //     // flask server it will be redirected to proxy
    //     fetch("/data").then((res) =>
    //         res.json().then((data) => {
    //             // Setting a data from api
    //             setdata({
    //                 name: data.Name,
    //                 age: data.Age,
    //                 date: data.Date,
    //                 programming: data.programming,
    //             });
    //         })
    //     );
    // }, []);

    
 
    return (
        // <div className="App">
        //     <header className="App-header">
        //         <h1>React and flask</h1>
        //         {/* Calling a data from setdata for showing */}
        //         <p>{data.name}</p>
        //         <p>{data.age}</p>
        //         <p>{data.date}</p>
        //         <p>{data.programming}</p>
 
        //     </header>
        // </div>


        // <div>
        //     {/* <SignUpButton /> */}
        //     {/* <SignUpForm /> */}
        //     <LoginForm />
        //     <SignUpForm />
        //     <ViewAuthInfo />
        // </div>



        // <BrowserRouter>
        //     <div className='App'>
        //         {!token && token!=="" && token!== undefined? 
        //             <LoginForm setToken={setToken}/>
        //         : (
        //             <Routes>
        //                 <Route exact path="/" element={<HelloWorld token={token} setToken={setToken}/>}></Route>
        //                 <Route exact path ="/credentials" element={<ViewAuthInfo token={token} setToken={setToken} />}></Route>
        //             </Routes>  
        //             ) 
        //         }
                
        //         <button onClick={removeToken}>Remove Token</button>
        //     </div>
        // </BrowserRouter>
        // <div>
        //     <LoginForm></LoginForm>
        // </div>
        <HomeScreen />

    );
}
 
export default App;