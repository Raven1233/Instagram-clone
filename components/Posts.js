import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Post from "./Post"

function Posts() {

    const DUMMY_DATA = [
        {
            id: "123",
            username: "dassubhadeep456",
            userImg: "https://classeventie.classiebit.com//upload/users/images/1537002962360.png",
            img: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/samurai-tim-wayland.jpg",
            caption: "SUBSCRIBE AND DESTROY",
        },
        {
            id: "123",
            username: "dassubhadeep456",
            userImg: "https://classeventie.classiebit.com//upload/users/images/1537002962360.png",
            img: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/samurai-tim-wayland.jpg",
            caption: "SUBSCRIBE AND DESTROY",
        },
        {
            id: "123",
            username: "dassubhadeep456",
            userImg: "https://classeventie.classiebit.com//upload/users/images/1537002962360.png",
            img: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/samurai-tim-wayland.jpg",
            caption: "SUBSCRIBE AND DESTROY",
        },
        {
            id: "123",
            username: "dassubhadeep456",
            userImg: "https://classeventie.classiebit.com//upload/users/images/1537002962360.png",
            img: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/samurai-tim-wayland.jpg",
            caption: "SUBSCRIBE AND DESTROY",
        }

        

    ]

    const [posts, setPosts] = useState([]);

    useEffect(()=>{
        const unsubscribe = onSnapshot(query(collection(db, 'posts'), orderBy('timestamp','desc')), snapshot =>{
            setPosts(snapshot.docs);
        })

        return unsubscribe;
    },[db])

    return (
        <div>
            {posts.map(post =>(
                <Post 
                    key={post.id} 
                    id={post.id} 
                    username={post.data().username}
                    userImg={post.data().profileImg} 
                    img={post.data().image} 
                    caption={post.data().caption} 
                />
            ))}
        </div>
    )
}

export default Posts
