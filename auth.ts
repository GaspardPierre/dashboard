import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';



async function getUser(email :string, password: string) {
  try {
    console.log('Sending login request for:', email, password);
    console.log(JSON.stringify({ email, password }));
    const response = await fetch(`http://localhost:5000/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify({ email, password }),
    });
   

    if (!response.ok) {
      console.error('Failed to fetch user. Response status:', response.status);
      throw new Error('Failed to fetch user.');
    }
    const user = await response.json();
    console.log('User fetched:', user);
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}



export const { auth, signIn, signOut } = NextAuth({
 
  ...authConfig,

  providers: [
    Credentials({
   
      async authorize(credentials) {
        
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email,password);
          const token = user.token;
          console.log("T*O*K*E*N*:", token);

        
          if (!user) return null;
          if (user) {
          
           
            return { email: user.email , token: user.token };
          } else {
           
           
          
            return {email, token }; 
          }
        }
        console.log('Invalid credentials');
        return null;
      },
    
    }),
  ],

  
});