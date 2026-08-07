import { useState, useEffect, useRef } from "react";
import { FaRobot } from "react-icons/fa";
import "./AIChatBot.css";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import api from "../../services/api";
import { BIKE_BRANDS } from "../../constants/bikes";

const bikeServices = [
  "Regular Maintenance",
  "Engine Repair",
  "Brake Service",
  "Chain Service",
  "Oil Change",
  "General Checkup",
];

function AIChatBot({ chatOpen, setChatOpen }) {

  const { customer } = useCustomerAuth();

  const [open, setOpen] = useState(false);

  const [showPopup, setShowPopup] = useState(true);

  const [messages, setMessages] = useState([]);

  const [step, setStep] = useState("name");

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [brand, setBrand] = useState("");

  const [bike, setBike] = useState("");

  const [category, setCategory] = useState("");

  const [product, setProduct] = useState("");

  const [input, setInput] = useState("");

  const [showContactButtons, setShowContactButtons] = useState(false);

  const bodyRef = useRef(null);

  useEffect(() => {

    const timer = setTimeout(() => {

      setShowPopup(false);

    },6000);

    return ()=>clearTimeout(timer);

  },[]);

  useEffect(()=>{

    if(bodyRef.current){

      bodyRef.current.scrollTop=
      bodyRef.current.scrollHeight;

    }

  },[messages]);

  const addBot=(text)=>{

    setMessages(prev=>[
      ...prev,
      {
        type:"bot",
        text
      }
    ]);

  };

  const addUser=(text)=>{

    setMessages(prev=>[
      ...prev,
      {
        type:"user",
        text
      }
    ]);

  };

  const openChat=()=>{

    setOpen(true);

    setChatOpen(true);

    setShowPopup(false);

    if(messages.length===0){

      addBot("👋 Welcome to R24 Automotive.");

      addBot("Please enter your Name to continue.");

    }

  };

  const closeChat=()=>{

    setOpen(false);

    setChatOpen(false);

  };

  const continueName=()=>{

    if(name.trim().length<3){

      return;

    }

    addUser(name);

    addBot("Please enter your 10 digit Mobile Number.");

    setStep("phone");

  };

  const continuePhone=()=>{

    if(!/^[6-9]\d{9}$/.test(phone)){

      return;

    }

    addUser(phone);

    addBot(`Welcome ${name} 👋`);

    addBot("Which brand is your bike?");

    setStep("brand");

  };

  const chooseBrand = (selectedBrand) => {

    setBrand(selectedBrand);

    addUser(selectedBrand);

    addBot(`Choose your ${selectedBrand} model.`);

    setStep("bike");

  };

  const chooseBike = (selectedBike) => {

    setBike(selectedBike);

    addUser(selectedBike);

    addBot("Select what you're looking for.");

    setStep("category");

  };

  const chooseCategory = (selectedCategory) => {

    setCategory(selectedCategory);

    addUser(selectedCategory);

    if(selectedCategory==="Accessories"){

      addBot("Choose an Accessory.");

      setStep("accessories");

    }

    if(selectedCategory==="Modification"){

      addBot("Choose a Modification.");

      setStep("modification");

    }

    if(selectedCategory==="Service"){

      addBot("Choose a Service.");

      setStep("service");

    }

  };

  const showProduct = (selectedProduct) => {

    setProduct(selectedProduct);

    addUser(selectedProduct);

    setStep("done");

    api.post("/chat-leads", {
      name,
      phoneNumber: phone,
      bikeModel: bike,
      category,
      productOrService: selectedProduct,
    }).catch((error) => {
      console.error("Error saving chat lead:", error);
    });

    addBot(
`✅ ${selectedProduct}

🏍 Bike : ${bike}

The latest price depends on

✔ Bike Model
✔ Variant
✔ Stock Availability

Please contact R24 Automotive for the latest price.`
    );

    setShowContactButtons(true);

  };
  const openWhatsApp = () => {

  const message = encodeURIComponent(

`Hello R24 Automotive 👋

My Name : ${name}

Phone Number : ${phone}

Bike Model : ${bike}

Product : ${product}

I would like to know:

• Latest Price
• Availability
• Installation Charges

Please provide the details.

Thank you.`

  );

  window.open(

`https://wa.me/918309560622?text=${message}`,

"_blank"

  );

};

  return(

<>

<div className="floating-ai">

{

showPopup && !open && (

<div className="ai-popup">

👋 Need help choosing KTM Accessories?

</div>

)

}

{

!open && (

<button
className="ai-button"
onClick={openChat}
>

<FaRobot />
<span className="ai-button-pulse"></span>

</button>

)

}

{

open && (

<div className="chat-container">

        <div className="chat-header">

          <div>

            <h3>R24 Automotive AI</h3>

            <span>
              {customer ? `🔒 Logged in as ${customer.name || "Rider"}` : "Online"}
            </span>

          </div>

          <button onClick={closeChat}>

            ✕

          </button>

        </div>

        <div
        className="chat-body"
        ref={bodyRef}
        >

        {

        messages.map((msg,index)=>(

        <div
        key={index}
        className={
        msg.type==="bot"
        ?
        "bot-message"
        :
        "user-message"
        }
        >

        {msg.text}

        </div>

        ))

        }

        {

        step==="name" && (

        <div className="lead-form">

          <input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          />

          <button
          disabled={name.trim().length<3}
          onClick={continueName}
          >

          Continue

          </button>

        </div>

        )

        }

        {

        step==="phone" && (

        <div className="lead-form">

          <input
          type="tel"
          placeholder="Enter Mobile Number"
          value={phone}
          maxLength={10}
          onChange={(e)=>setPhone(
          e.target.value.replace(/\D/g,"")
          )}
          />

          <button
          disabled={!/^[6-9]\d{9}$/.test(phone)}
          onClick={continuePhone}
          >

          Continue

          </button>

        </div>

        )

        }
                {

        step==="brand" && (

        <div className="menu-buttons">

          <h4>Choose Your Bike Brand</h4>

          {BIKE_BRANDS.map((group) => (
            <button key={group.brand} onClick={()=>chooseBrand(group.brand)}>
              🏍 {group.brand}
            </button>
          ))}

        </div>

        )

        }

        {

        step==="bike" && (

        <div className="menu-buttons">

          <h4>Choose Your {brand} Model</h4>

          {(BIKE_BRANDS.find((group) => group.brand === brand)?.models || []).map((bikeName) => (
            <button key={bikeName} onClick={()=>chooseBike(bikeName)}>
              🏍 {bikeName}
            </button>
          ))}

        </div>



        )


        }


        {

        step==="category" && (

        <div className="menu-buttons">

          <h4>Select Category</h4>

          <button onClick={()=>chooseCategory("Accessories")}>
            🪖 Accessories
          </button>

          <button onClick={()=>chooseCategory("Modification")}>
            🔥 Modification
          </button>

          <button onClick={()=>chooseCategory("Service")}>
            🛠 Bike Service
          </button>

        </div>

        )

        }

        {

        step==="accessories" && (

        <div className="menu-buttons">

          <h4>Select Product</h4>

          <button onClick={()=>showProduct("Premium Crash Guard")}>
            Premium Crash Guard
          </button>

          <button onClick={()=>showProduct("Premium Riding Helmet")}>
            Premium Riding Helmet
          </button>

          <button onClick={()=>showProduct("Performance Exhaust")}>
            Performance Exhaust
          </button>

          <button onClick={()=>showProduct("LED Headlight")}>
            LED Headlight
          </button>

          <button onClick={()=>showProduct("Premium Alloy Wheels")}>
            Premium Alloy Wheels
          </button>

          <button onClick={()=>showProduct("Riding Gloves")}>
            Riding Gloves
          </button>

        </div>

        )

        }

        {

        step==="modification" && (

        <div className="menu-buttons">

          <h4>Select Modification</h4>

          <button onClick={()=>showProduct("Full Bike Modification")}>
            Full Bike Modification
          </button>

          <button onClick={()=>showProduct("Sticker Kit")}>
            Sticker Kit
          </button>

          <button onClick={()=>showProduct("Premium Wrapping")}>
            Premium Wrapping
          </button>

          <button onClick={()=>showProduct("Custom Lighting")}>
            Custom Lighting
          </button>

        </div>

        )

        }

        {

        step==="service" && (

        <div className="menu-buttons">

          <h4>Select Service</h4>

          {bikeServices.map((service) => (
            <button key={service} onClick={()=>showProduct(service)}>
              🛠 {service}
            </button>
          ))}

        </div>

        )

        }

        </div>

        {

        showContactButtons && (

        <div className="chat-actions">

          <button onClick={openWhatsApp}>

💬 WhatsApp

</button>

          <button onClick={()=>window.location.href="tel:+918309560622"}>
            📞 Call
          </button>

          <button onClick={()=>window.open("https://maps.google.com/?q=R24+Automotive+Wardhannapet","_blank")}>
            📍 Visit Shop
          </button>

        </div>

        )

        }

                </div>

      )

      }

</div>

</>

  );

}
export default AIChatBot;