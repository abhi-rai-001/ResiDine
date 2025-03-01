import { type } from 'os'
import { create } from 'zustand'
import {persist} from 'zustand/middleware'



const useBookRoom= create()(
   persist( (set) => ({
    bookingRoomData: null,
    paymentIntent: null,
    clientSecret: undefined,
  setRoomData: (data)=>{
     set({bookingRoomData:data})
  },
   
  setPaymentIntent: (paymentIntent)=>{
     set({paymentIntent})
  },
  setClientSecret: (clientSecret)=>{
     set({clientSecret})
  },
  resetBookRoom: ()=>{
     set({  bookingRoomData: null,
      paymentIntent: null,
      clientSecret: undefined,})
  },
  
  
  }),{
    name:'BookRoom',
  }) 
   
)
 export default useBookRoom;