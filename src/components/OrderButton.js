import {useState, useEffect} from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap'

function OrderButton ({quantity, handleDelete, id, handleUpdate, isAddButtonDisabled}){
  const [count, setCount] = useState(parseInt(quantity));
  
  useEffect(() => {
    handleUpdate(id,count);
      if(count === 0){
        handleDelete(id);
      }

  }, [count]);

  const renderTooltip = () => (
    <Tooltip id="button-tooltip">
        This item is out of stock. Unable to add more
    </Tooltip>
  );
  
    return(
      <div class="btn-group">
        <OverlayTrigger
          placement="top"
          overlay={
            isAddButtonDisabled(id, count)
            ? renderTooltip()
            : <></>
          }
        ><span className="d-inline-block">
          <button 
            type="button" 
            class="btn btn-warning" 
            onClick={()=>setCount(count+1)}
            disabled={isAddButtonDisabled(id, count)}
          >
            <i class="bi bi-plus"></i>
          </button>
        </span>
        </OverlayTrigger>

        <button class="btn btn-success">{count}</button>
        <button type="button" class="btn btn-warning" onClick={()=>setCount(count-1)}>
          <i class="bi bi-dash"></i>
        </button>
        <button type="button" class="btn btn-danger" onClick={()=>setCount(0)}>
          <i class="bi bi-trash"></i>
        </button>
      </div>
     
    );
  }

  export default OrderButton;