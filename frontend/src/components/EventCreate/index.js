import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import * as eventActions from "../../store/events";
import "./EventCreate.css"

function EventCreate() {


  const dispatch = useDispatch();
  const history = useHistory();
  const { groupId } = useParams();
  // console.log("groupid", groupId)

  useEffect(() => {
    dispatch(eventActions.getOneEventThunk(groupId))
  }, [dispatch])

  const singleGroup = useSelector(state => state.groups.singleGroup);
  let groupeName;
  // let groupeId;
  if (singleGroup) {
    groupeName = singleGroup.name
    // groupeId = singleGroup.id
  }


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [isPrivate, setIsPrivate] = useState("")
  const [capacity, setCapacity] = useState("")
  const [price, setPrice] = useState("")
  const [startDateRaw, setStartDateRaw] = useState("")
  const [endDateRaw, setEndDateRaw] = useState("")
  const [url, setUrl] = useState("")

  const [VEs, setVEs] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);


  //----------------------- VALIDATION ERRORS -----------------------
  //----------------------- VALIDATION ERRORS -----------------------
  //----------------------- VALIDATION ERRORS -----------------------
  //----------------------- VALIDATION ERRORS -----------------------

  useEffect(() => {

  }, [name, description, type, isPrivate, price, capacity, startDateRaw, endDateRaw, url])

  const onSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    //----------------------- TIME NORMALIZER -----------------------
    //----------------------- TIME NORMALIZER -----------------------

    let sDate = startDateRaw.slice(0, 10)
    let sTime = startDateRaw.slice(11, 16)
    const startDate = `${sDate} ${sTime}:00`

    let eDate = endDateRaw.slice(0, 10)
    let eTime = endDateRaw.slice(11, 16)
    const endDate = `${eDate} ${eTime}:00`


    //----------------------- TIME NORMALIZER -----------------------
    //----------------------- TIME NORMALIZER -----------------------

    const event = {
      venueId: 1,
      name,
      type,
      isPrivate,
      capacity,
      price,
      startDate,
      endDate,
      url,
      description,
      groupId
    }

    console.log(event);

    try {
      const res = await dispatch(eventActions.createEventThunk(event));
      console.log("thunk try", res)
      if (res.id) {
        await dispatch(eventActions.getOneEventThunk(3))
        history.push(`/events/${res.id + 1}`);
      } else {
        return res;
      }
    } catch (res) {
      console.log("thunk catch", res)
      const data = await res.json();
      console.log("got errors son", data)
    }
  }

  return (
    <>
      <div className="OofDiv">
        <form onSubmit={onSubmit}>
          <div className="fullFormDiv">

            {/* header */}
            <div className="ereader">
              <div>
                <h2>Create an event for {groupeName}</h2>
              </div>
            </div>

            {/* name */}
            <div className="name">
              <div>What is the name of your event?</div>
              <div className="nameInput">
                <input
                  className="actualNameInput"
                  size={40}
                  type="text"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="What is your event name?"
                  required
                />
              </div>
            </div>
            {/* error popups */}
            {hasSubmitted && VEs.name && (<div className="errorPops">{VEs.name}</div>)}

            {/* type */}
            <div className="porSelDiv">
              <div className="headerSpace">Is this an in person or online event?</div>
              <div className="poroSelector">
                <select
                  className="actualPoroSelector"
                  onChange={(e) => setType(e.target.value)}
                  value={type}
                >
                  <option key="(select one)" value="(select one)">
                    (select one)
                  </option>
                  <option key="Online" value="Online">Online</option>
                  <option key="In person" value="In person">In person</option>
                </select>
              </div>
              {/* error popups */}
              {hasSubmitted && VEs.type && (<div className="errorPops">{VEs.type}</div>)}

              {/* PP */}
              <div>Is this event private or public?</div>
              <div className="ppSelector">
                <select
                  className="actualPpSelector"
                  onChange={(e) => setIsPrivate(e.target.value)}
                  value={isPrivate}
                >
                  <option value="(select one)">
                    (select one)
                  </option>
                  <option key="Private" value={true}>Private</option>
                  <option key="Public" value={false}>Public</option>
                </select>
              </div>
              {/* error popups */}
              {hasSubmitted && VEs.isPrivate && (<div className="errorPops">{VEs.isPrivate}</div>)}


              {/* price */}
              <div>What is the price for your event?</div>
              <div className="priceInput">
                <input
                  className="actualPriceInput"
                  type="number"
                  name="price"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  placeholder="0 is allowed"
                  required
                />
              </div>
              {/* error popups */}
              {hasSubmitted && VEs.price && (<div className="errorPops">{VEs.price}</div>)}

              {/* capacity */}
              <div>How many people can attend your event?</div>
              <div className="capacityInput">
                <input
                  className="actualCapacityInput"
                  type="number"
                  name="capacity"
                  onChange={(e) => setCapacity(e.target.value)}
                  value={capacity}
                  placeholder="0 is allowed, but weird"
                  required
                />
              </div>
              {/* error popups */}
              {hasSubmitted && VEs.capacity && (<div className="errorPops">{VEs.capacity}</div>)}
            </div>

            {/* date */}
            <div className="porDatDiv">
              <div className="headerSpace">When does your event start?</div>
              <div className="dateInput">
                <input
                  className="actualDateInput"
                  type="datetime-local"
                  name="startTime"
                  onChange={(e) => setStartDateRaw(e.target.value)}
                  value={startDateRaw}
                />
              </div>
              {/* error popups */}
              {hasSubmitted && VEs.startDate && (<div className="errorPops">{VEs.startDate}</div>)}

              <div>When does your event end?</div>
              <div className="dateInput">
                <input
                  className="actualDateInput"
                  type="datetime-local"
                  name="endTime"
                  onChange={(e) => setEndDateRaw(e.target.value)}
                  value={endDateRaw}
                />
              </div>
              {/* error popups */}
              {hasSubmitted && VEs.endDate && (<div className="errorPops">{VEs.endDate}</div>)}
            </div>

            {/* image */}
            <div className="porImgDiv">
              <div className="headerSpace">Please add an image url for your event below:</div>
              <div className="imgInput">
                <input
                  className="actualImgInput"
                  size={40}
                  type="url"
                  name="url"
                  onChange={(e) => setUrl(e.target.value)}
                  value={url}
                  placeholder="Image URL"
                  required
                />
              </div>
              {/* error popups */}
              {hasSubmitted && VEs.url && (<div className="errorPops">{VEs.url}</div>)}
            </div>

            {/* description */}
            <div className="porDescDiv">
              <div className="headerSpace">Please describe your event</div>
              <div className="descriptionTextArea">
                <textarea
                  className="actualDescriptionTextArea"
                  name="description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  placeholder="Please write at least 50 characters"
                  required
                  cols={60}
                  rows={10}
                />
              </div>
              {/* error popups */}
              {hasSubmitted && VEs.about && (<div className="errorPops">{VEs.description}</div>)}
            </div>
          </div>
          <div className="submitButton">
            <button className="actualSubmitButton">Create Event</button>
          </div>

        </form >
      </div>
    </>
  )

}

export default EventCreate
