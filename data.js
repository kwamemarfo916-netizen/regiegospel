import { app } from "./fb.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
const db=getFirestore(app);
const all=async c=>{try{return (await getDocs(collection(db,c))).docs.map(d=>({id:d.id,...d.data()}))}catch(e){console.error(c,e);return null}};
const one=async()=>{try{const s=await getDoc(doc(db,"settings","site"));return s.exists()?s.data():{}}catch(e){console.error(e);return {}}};
const [songs,events,releases,settings]=await Promise.all([all("songs"),all("events"),all("releases"),one()]);
if(window.rgApply)window.rgApply({songs,events,releases,settings});
