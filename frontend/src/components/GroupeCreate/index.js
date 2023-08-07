import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import * as groupeActions from "../../store/groupes";
import "./GroupeCreate.css"

// dan said it doesn't have to be like the wireframe here
const statesArr = [
  "State", "AL", "AK", "AZ", "AR", "AS", "CA", "CO", "CT", "DE",
  "DC", "FL", "GA", "GU", "HI", "ID", "IL", "IN", "IA", "KA",
  "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT",
  "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "MP", "OH",
  "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "TT",
  "UT", "VT", "VA", "VI", "WA", "WV", "WI", "WY",
];

function GroupeCreate() {

  const dispatch = useDispatch();
  const history = useHistory();

  //controleds
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("");
  const [isPrivate, setIsPrivate] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [url, setUrl] = useState("")

  const [VEs, setVEs] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const errors = {};
    // if (!name.length) errors["name"] = "Name is required"
    if (name.length > 60) errors["name"] = "Name must be 60 characters or less"
    if (!city.length) errors["city"] = "City is required"
    if (state === "" || state === "State") errors["state"] = "State is required"
    if (about.length < 50) errors["about"] = "Description must be at least 50 characters long"
    if (type === "") errors["type"] = "Group Type is required"
    if (isPrivate === "") errors["isPrivate"] = "Visibility Type is required"
    if (url.includes(".png")) {
    } else if (url.includes(".jpg")) {
    } else if (url.includes(".jpeg")) {
    } else if (url.includes("unsplash.com")) {
    } else {
      errors["url"] = "Image URL must end in .png, .jpg, .jpeg, or be from unsplash.com"
    }

    setVEs(errors);
  }, [name, city, state, about, type, isPrivate, url])

  const onSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const groupe = {
      name,
      about,
      type,
      isPrivate,
      city,
      state,
      url,
    }

    // const res = await dispatch(groupeActions.createGroupeThunk(groupe));
    //--------- ^^^ don't need this my ass
    // console.log(res)
    // history.push(`/groups/${res.id}`);

    // BETTER ERRORS
    if (!Object.entries(VEs).length) {
      try {
        const res = await dispatch(groupeActions.createGroupeThunk(groupe));
        //--------- ^^^ don't need this my ass
        console.log("thunk try", res)
        if (res.id) {
          //===============================
          history.push(`/groups/${res.id}`);
          //===============================
          // IF YOU EVEN THINK OF REMOVING ^ THIS EVERYTHING BREAKS, DON'T TOUCH IT
          // BUT ALSO PROBABLY DON'T REPLICATE IT. IT SHOULDN'T WORK. IT JUST DOES
          // I KNOW WHY THIS WORKS AND IT DOES NEED TO BE THERE
        } else {
          return res;
        }
      } catch (res) {
        console.log("thunk catch", res)
        const data = await res.json();
        console.log("got errors son", data)
      };
    } else {
      console.log("FIX YOUR INPUTS, LOOK AT THE VALIDATION ERRORS")
    }

    // setName("")
    // setAbout("")
    // setType("")
    // setIsPrivate("(select one)")
    // setCity("")
    // setState("")
    // setUrl("")

  }

  return (
    <>
      <div className="OofDiv">
        <form onSubmit={onSubmit}>
          <div className="fullFormDiv">

            {/* header */}
            <div className="breader">
              <div>BECOME AN ORGANIZER</div>
              <div>
                <h2>We'll walk you through a few steps to build your local community</h2>
              </div>
            </div>

            {/* location */}
            <div className="OofLocation">
              <div>
                <h2>First, set your group's location</h2>
              </div>
              <div>
                <span>Meetup groups meet locally, in person, and online. We'll connect you with peolpe in your area, and more can join online</span>
              </div>
              <div className="locationInput">
                <span>
                  <input
                    className="actualLocationInput"
                    type="text"
                    size={40}
                    name="city"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                    placeholder="City"
                    required
                  />
                </span>
                <span>
                  <select
                    className="actualLocationSelector"
                    onChange={(e) => setState(e.target.value)}
                    value={state}
                  >
                    {statesArr.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </span>
                {/* error popups */}
                {hasSubmitted && VEs.city && !VEs.state ? <div className="errorPops">{VEs.city}</div> : null}
                {hasSubmitted && !VEs.city && VEs.state ? <div className="errorPops">{VEs.state}</div> : null}
                {hasSubmitted && VEs.city && VEs.state ? <div className="errorPops">{VEs.city} · {VEs.state}</div> : null}
              </div>
            </div>

            {/* name */}
            <div className="Oofname">
              <div>
                <h2>What will your group's name be?</h2>
              </div>
              <div>
                <div>Choose a name that will give people a clear idea of what the group is about.
                </div>
                <div>
                  Feel free to get creative! You can edit this later if you change your mind</div>
              </div>
              <div className="nameInput">
                <input
                  className="actualNameInput"
                  size={40}
                  type="text"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="What is your group name? Keep it under 60...or else."
                  required
                />
              </div>
              {/* error popups */}
              {hasSubmitted && VEs.name && (<div className="errorPops">{VEs.name}</div>)}
            </div>

            {/* about */}
            <div className="about">
              <div>
                <h2>Now describe what your group will be about</h2>
              </div>
              <div>
                <span>People will see this when we promote your group, but you'll be able to add to it later, too.</span>
              </div>
              <div>1. What's the purpose of the group?</div>
              <div>2. Who should join?</div>
              <div>3. What will you do at your events?</div>
              <div className="aboutTextArea">
                <textarea
                  className="actualAboutTextArea"
                  name="about"
                  onChange={(e) => setAbout(e.target.value)}
                  value={about}
                  placeholder="Please write at least 50 characters"
                  required
                  cols={40}
                  rows={10}
                />
              </div>
              {/* error popups */}
              {hasSubmitted && VEs.about && (<div className="errorPops">{VEs.about}</div>)}
            </div>

            {/* Final steps */}
            <div className="finalSteps">
              <div>
                <h2>Final Steps</h2>
              </div>
              <div>Is this an in person or online group?</div>
              <div className="poroSelector">
                <select
                  className="actualPoroSelector"
                  onChange={(e) => setType(e.target.value)}
                  value={type}
                >
                  <option key="(select one)" value="">
                    (select one)
                  </option>
                  <option key="Online" value="Online">Online</option>
                  <option key="In person" value="In person">In person</option>
                </select>
              </div>
              {/* error popups */}
              {hasSubmitted && VEs.type && (<div className="errorPops">{VEs.type}</div>)}

              <div>Is this group private or public?</div>
              <div className="ppSelector">
                <select
                  className="actualPpSelector"
                  onChange={(e) => setIsPrivate(e.target.value)}
                  value={isPrivate}
                >
                  <option key="(select one)" value="">
                    (select one)
                  </option>
                  <option key="Private" value={true}>Private</option>
                  <option key="Public" value={false}>Public</option>
                </select>
              </div>
              {/* error popups */}
              {hasSubmitted && VEs.isPrivate && (<div className="errorPops">{VEs.isPrivate}</div>)}

              {/* image */}
              <div>Please add an image url for your group below:</div>
              <div className="imgInput">
                <input
                  className="actualImgInput"
                  type="url"
                  size={40}
                  name="url"
                  onChange={(e) => setUrl(e.target.value)}
                  value={url}
                  placeholder="Image URL"
                  required
                />
              </div>
              {/* error popups */}
              {hasSubmitted && VEs.url && (<div className="errorPops">{VEs.url}</div>)}
              {/* divider */}
            </div>
            <div className="submitButton">
              <button className="actualSubmitButton">Create Group</button>
            </div>

          </div>
        </form >
      </div>
    </>
  )
}

export default GroupeCreate
