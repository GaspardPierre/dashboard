import { Suspense } from 'react';
import { RevenueChartSkeleton } from '@/app/ui/skeletons';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import { lusitana } from '../../ui/font';
import { CreateRevenue } from '@/app/ui/invoices/buttons';


export default async function Page() {

 


  return (
    <main>
       
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Revenues
      </h1>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateRevenue/>
      </div>
     
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-6">
     
      <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
   
  
      </div>
    </main>
  );
}
