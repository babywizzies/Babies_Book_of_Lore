import { useState, useEffect, useContext } from "react";
import { ActorContext } from "../../components/actorContext";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import styles from "../../components/writeLore.module.css";
import axios from "axios";
import Link from "next/link";

export default function MakeAContribution() {
  const CCContributionTitle = "Make A Contribution";
  const CCContributionDescription = "The Chaotic Compendium is a place for one and all cult members to record and ruminate over their travels across the Runiverse. No tale or tidbit is too grand or too grainy to share, for you sit amongst kinfolk of !magic and myth who cherish fables both big and small. Write your rune upon the wall, and if or when you're ready, transcribe it into the Book of Lore."
  const CCContributionImg = "/images/The Chaotic Compendium Complete.png";
  const CCContributionRunes = ["/images/runes/dol_rune.png", "/images/runes/ort_rune.png", "/images/runes/eld_rune.png", "/images/runes/lem_rune.png"]; // Passion
  const CCContributionReturn = "/";

  const { actorAvatar } = useContext(ActorContext);

  const router = useRouter();

  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [input, setInput] = useState({
    img: "",
    title: "",
    body: ""
  })

  // ACTIONS
  function handleInput(e) {
    setInput((prevState) => {
      return ({
        ...prevState,
        [e.target.name]: e.target.value
      })
    })
  }

  async function contribute() {
    if (actorAvatar.name === "A Chaos Portal Opens...") {
      alert("The ANDTHENEUM does not allow Chaos Portals to engage with its materials. Please step through the portal with an Avatar to fan a flame or make a contribution...");
      return
    }
    if (actorAvatar.universe !== "Forgotten Babies Wizard Orphanage") {
      alert("The ANDTHENEUM only allows babies from the Wizard Orphanage to write lore here. Please step through the portal with a baby to make a contribution");
      return
    }
    if (input.title === "" || input.body === "" || input.img === ""){
      alert("Your contribution is missing a title, body, or image...");
    } else {
      const newContribution = {
        avatar: actorAvatar,
        content: {
          img: input.img,
          title: input.title,
          body: input.body
        }
      }
      if (confirm("The ANDTHENEUM will accept your offering...")){
        await axios.post("/api/lore/post-lore", newContribution).then(result => {
          console.log(result.data);
          router.push("/");
        })
      }
    }
  }

  return (<Layout pageTitle={CCContributionTitle} pageDescription={CCContributionDescription} pageImg={CCContributionImg} pageRunes={CCContributionRunes} pageReturn={CCContributionReturn}>
    <div className={styles.contributionHolder}>
      <h1>Crafting Lore...</h1>
      <div className={styles.imgPreviewHolder}>
        <h2>Image Preview:</h2>
        {input.img !== "" ? <img className={styles.imgPreview} src={input.img}/> : <h5>Pending image URL...</h5>}

      </div>
      <div className={styles.contributorHolder}>
        <img className={styles.contributorImg} src={actorAvatar.img} />
        <div className={styles.contributorInfo}>
          <div className={styles.contributorText}>Lore Writer:</div>
          <h2>{actorAvatar.name}</h2>
          <h4>{actorAvatar.universe}</h4>
        </div>
      </div>
      <form className={styles.input} onSubmit={(event)=>event.preventDefault()}>
        <input
          className={styles.input}
          onChange={handleInput}
          value={input.img}
          name="img"
          type="text"
          placeholder="Image of Contribution (URL)"
        /> <br/>
        <input
          className={styles.input}
          onChange={handleInput}
          value={input.title}
          name="title"
          type="text"
          placeholder="Title of Contribution"
        /> <br/>
        <textarea
          className={styles.input}
          onChange={handleInput}
          value={input.body}
          spellCheck="true"
          name="body"
          placeholder="Body of Contribution"
        />
        <button type="submit" className="hover-btn float-right" onMouseUp={contribute}>Contribute</button>
      </form>
    </div>
  </Layout>
  )
}
