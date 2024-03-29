'use server'
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
//on vide le cache du serveur
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
  .number()
  .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'],{
  invalid_type_error: 'Please select an invoice status.'}),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({id : true, date: true});


//**CREATE INVOICE */
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
 
export async function createInvoice(prevState: State, formData: FormData) {



  
    // Validate form using Zod

  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

// If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  const invoiceData = {
    customerId,
    amount: amountInCents,
    status,
    date,
    items: [],
    dueDate: null,
  };

  try {
    const response = await fetch('http://localhost:5000/api/invoices/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: invoiceData.customerId, 
        items: invoiceData.items, 
        amount: invoiceData.amount,
        date: invoiceData.date, 
        dueDate: invoiceData.dueDate, 
        status: invoiceData.status, 
      }),
      
    });
 console.log("response en front ..", response.status)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Additional logic for handling response...
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
    ;
     
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}  


//**EDIT INVOICE */

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields= UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 

// If form validation fails, return errors early. Otherwise, continue.
if (!validatedFields.success) {
  return {
    errors: validatedFields.error.flatten().fieldErrors,
    message: 'Missing Fields. Failed to Create Invoice.',
  };
}
const { customerId, amount, status } = validatedFields.data;
const amountInCents = amount * 100;
  try {
    
  
 
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
} catch (error) {
  return { message: 'Database Error: Failed to Update Invoice.' }; 
}
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


//**DELETE INVOICE */

export async function deleteInvoice(id: string) {

try {
  

  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
} catch (error) {
  return { message: 'Database Error: Failed to Delete Invoice.' }; 
}
}


//******AUTHENTIFICATION */

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
 
    const email = formData.get('email');
    const password = formData.get('password');
 

  
    await signIn('credentials', {
      redirect: true, 
      email,
      password,
   
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}