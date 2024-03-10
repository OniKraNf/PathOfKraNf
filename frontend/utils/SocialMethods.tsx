import AuthContext from "@/context/AuthContext";
import { useContext } from "react";

export const likePost = async (postId: number, accessToken: string | undefined, refreshToken: string | undefined, logoutUser: Function) => {
    try {
        const response = await fetch(`http://localhost:8000/api/post/${postId}/like/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log({'Data': data})
            return data.likes
        } else if (response.status === 401 && refreshToken) {
            const newAccessToken = await refreshAccessToken(refreshToken, logoutUser);    
            if (newAccessToken) {
                await likePost(postId, newAccessToken, refreshToken, logoutUser);
            } else {
                console.error('Failed to refresh access token');
            }
        }
        else {
            console.error('Failed to like post: ', response.statusText);
        }
    } catch (error) {
        console.error(error)
    }
}

export const refreshAccessToken = async (refreshToken : string, logoutUser: Function) => {
    try {
        const response = await fetch('http://localhost:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken })
        })

        if (response.ok) {
            const data = await response.json();
            if (data && data.access) {
                const newAccessToken = data.access;
                const refreshAndAccessTokens = {
                    'access': newAccessToken,
                    'refresh': refreshToken,
                };
                localStorage.setItem('authTokens', JSON.stringify(refreshAndAccessTokens));
                return newAccessToken;
            }
        } else {
            logoutUser();
            return null;
        }

    } catch (error) {
        logoutUser();
        console.log(error)
        return null;
    }
}

export const loadPost = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/post/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return data;
        }
    } catch (error) {
        console.error(error);
    }
}

export const certainPostLoad = async (id: string) => {
    try {
        const response = await fetch(`http://localhost:8000/api/post/${id}`);

        if (response.ok) {
            const postData = await response.json();

            return postData;
        } else {
            console.error('Response not OK');
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const postComment = async (user_id: number, post_id: number, text: string) => {
    try {
        const response = await fetch('http://localhost:8000/api/comment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({user_id: user_id, post_id: post_id, text: text}),
        });
        
        if (!response.ok) {
            console.error('Failed to post comment:', response.statusText);
            return null;
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error posting comment:', error);
        return null;
    }
}

export const deleteComment = async (comment_id: number): Promise<boolean> => {
    try {
        const response = await fetch(`http://localhost:8000/api/comment/${comment_id}/delete/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            console.error('Failed to delete comment:', response.statusText);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error deleting comment:', error);
        return false;
    }
}

export const certainProfile = async (username: string) => {
    try {
        const response = await fetch(`http://localhost:8000/api/profile/${username}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }

        })

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return data;
        }

    } catch (error) {
        console.error(error);
        return null;
    }
}

export const createPost = async (user_id: number, title: string, content: string) => {
    try {
        const response = await fetch('http://localhost:8000/api/post/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: user_id, title: title, description: content})
        })

        if (response.ok) {
            const data = await response.json();
            console.log({'Success': true});
            return data;
        }
    } catch (error) {
        console.error(error)
        return null;
    }
}