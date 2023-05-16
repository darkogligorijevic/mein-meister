// import { createContext, useState, useEffect } from "react";
// import axios from "axios";


// export const MeisterContext = createContext()

// export const MeisterContextProvider = ({children}) => {
    
//     const [currentMeister, setCurrentMeister] = useState(JSON.parse(localStorage.getItem("meister")) || null)
    
//     useEffect(() => {
//         localStorage.setItem("meister", JSON.stringify(currentMeister))
//     }, [currentMeister])

//     const becomeMeister = async(inputs) => {
//         const token = localStorage.getItem('token');
//         const config = {
//           headers: { Authorization: `Bearer ${token}` },
//         };
//         const response = await axios.post(
//           'http://localhost:5000/api/workers',
//           inputs,
//           config
//           );
//         setCurrentMeister(response.data)
//     }
    
//     const deleteMeister = (workerId) => {
//         axios.delete("http://localhost:5000/api/workers/" + workerId)
//     }
    
//     const updateMeister = (workerId) => {
//         axios.patch("http://localhost:5000/api/workers/" + workerId)
//     }
    
//     const createPost = async (workerId, inputs) => {
//         await axios.post("http://localhost:5000/api/posts/" + workerId, inputs)
//     }

//     const updatePost = (postId, workerId) => {
//         axios.patch(`http://localhost:5000/api/posts/update/${postId}/worker/${workerId}`)
//     }

//     const deletePost = (postId, workerId) => {
//         axios.delete(`http://localhost:5000/api/posts/delete/${postId}/worker/${workerId}`)
//     }


//     return (
//         <MeisterContext.Provider value={{
//             currentMeister, 
//             deleteMeister, 
//             becomeMeister, 
//             updateMeister,
//             updatePost,
//             deletePost,
//             createPost
//         }}>
//             {children}
//         </MeisterContext.Provider>
//     )
// }