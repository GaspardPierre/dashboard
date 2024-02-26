
import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from "next/headers";
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  LatestInvoice,
  User,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { NextRequest } from 'next/server';



export async function fetchRevenue() {

  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  const authToken = cookies().get("jwt")?.value;
  console.log(authToken, "TOKEN*******************************");
  



  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)
    const response = await fetch('http://localhost:5000/api/revenues', {
      method: 'GET',
      headers: {
    
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const revenueData = await response.json();
    return revenueData;
  } catch (error) {
    console.error('Failed to fetch revenue data:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}
export async function fetchLatestInvoices() {

  noStore();

  
 
  try {
 
    const response = await fetch('http://localhost:5000/api/invoices/latest', {
      method: 'GET',
      headers: {
    
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
    });

    if (!response.ok) {
      console.error('Réponse API non OK:', response);
      throw new Error('Réseau ou réponse API invalide.');
    }

    const invoicesData = await response.json();

    // Conversion des données de facturation
    const latestInvoices = invoicesData.map(invoice => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return latestInvoices;
  } catch (error) {
    console.error('Erreur dans fetchLatestInvoices:', error);
    throw new Error('Échec de la récupération des dernières factures.');
  }
}


export async function fetchCardData() {
  noStore();

  try {

    const response = await fetch('http://localhost:5000/api/dashboard' ,   {

      method: 'GET',
    headers: {
  
      'Content-Type': 'application/json',
    },
    credentials: 'include', 
  });

    if (!response.ok) {
      throw new Error(`Erreur de réponse API pour les données du tableau de bord: ${response.statusText}`);
    }

    const dashboardData = await response.json();
console.log(dashboardData.numberOfInvoices);

    return {
      numberOfCustomers: dashboardData.numberOfCustomers,
      numberOfInvoices: dashboardData.numberOfInvoices,
      totalPaidInvoices: formatCurrency(dashboardData.totalPaidInvoices),
      totalPendingInvoices: formatCurrency(dashboardData.totalPendingInvoices)
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données du tableau de bord:', error);
    throw new Error('Échec de la récupération des données du tableau de bord.');
  } 
}

 
  

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const url = `http://localhost:5000/api/invoices/filtered?query=${query}&page=${currentPage}`;
  console.log('Début de fetchFilteredInvoices, URL:', url);

  try {
    const response = await fetch(url,  {


    method: 'GET',
  headers: {

    'Content-Type': 'application/json',
  },
  credentials: 'include', 
});
console.log('Réponse reçue, Statut:', response.status);
if (!response.ok) {
  console.error('Réponse API non OK, Statut:', response.status, 'Statut Text:', response.statusText);
  throw new Error('Réseau ou réponse API invalide.');
}
    const invoices = await response.json();
    console.log('Factures récupérées:', invoices);
    return invoices;
  } catch (error) {
    console.error('Erreur dans fetchFilteredInvoices:', error);
    throw new Error('Échec de la récupération des factures filtrées.');
  }
}


export async function fetchInvoicesPages(query: string) {
  try {
    const response = await fetch(`http://localhost:5000/api/invoices/search?search=${query}`);
    if (!response.ok) {
      throw new Error('Réseau ou réponse API invalide.');
    }
    const { totalPages } = await response.json();
    
    return totalPages;
  } catch (error) {
    console.error('Erreur dans fetchInvoicesPages:', error);
    throw new Error('Échec de la récupération du nombre total de pages de factures.');
  }
}


export async function fetchInvoiceById(id: string) {
  try {
    const response = await fetch(`http://localhost:5000/api/invoices/${id}`);
    if (!response.ok) {
      throw new Error('Réseau ou réponse API invalide.');
    }
    const invoice = await response.json();
    return {
      ...invoice,
      // Convertir le montant de cents en dollars si nécessaire
      amount: invoice.amount / 100,
    };
  } catch (error) {
    console.error('Erreur dans fetchInvoiceById:', error);
    throw new Error('Échec de la récupération de la facture.');
  }
}


export async function fetchCustomers() {
  try {
    const response = await fetch('http://localhost:5000/api/customers');
    if (!response.ok) {
      throw new Error('Réseau ou réponse API invalide.');
    }
    const customers = await response.json();
    return customers;
  } catch (err) {
    console.error('Erreur dans fetchCustomers:', err);
    throw new Error('Échec de la récupération de tous les clients.');
  }
}


export async function fetchFilteredCustomers(query: string) {
  try {
    const response = await fetch(`http://localhost:5000/api/customers/filtered?search=${query}`);
    if (!response.ok) {
      throw new Error('Réseau ou réponse API invalide.');
    }
    const customers = await response.json();
    // Mappez ici pour formater les valeurs monétaires, si nécessaire
    return customers;
  } catch (err) {
    console.error('Erreur dans fetchFilteredCustomers:', err);
    throw new Error('Échec de la récupération de la table des clients.');
  }
}

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const response = await fetch(`http://localhost:5000/api/users/by-email/${encodeURIComponent(email)}`);
    if (!response.ok) {
      throw new Error('Réseau ou réponse API invalide.');
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Erreur dans getUser:', error);
    throw new Error('Échec de la récupération de l\'utilisateur.');
  }
}
