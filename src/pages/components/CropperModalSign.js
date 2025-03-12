import AvatarEditor from 'react-avatar-editor'
import { useRef, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

const modalStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const CropperModalSign = ({ src, modalOpen, text, handleSaveFunction }) => {
  const [slideValue, setSlideValue] = useState(10)
  const cropRef = useRef(null)

  const handleSave = async () => {
    if (cropRef) {
      const dataUrl = cropRef.current.getImage().toDataURL()
      const result = await fetch(dataUrl)
      const blob = await result.blob()
      handleSaveFunction(URL.createObjectURL(blob), text, true)
      handleSaveFunction(dataUrl, text, false)
      handleSaveFunction(false, text, 'open')
    }
  }
  const closeModal = () => {
    handleSaveFunction(false, text, 'open')
    handleSaveFunction(null, text, true)
  }

  return (
    <Modal sx={modalStyle} show={modalOpen && text ? modalOpen[text] : false}>
      <Modal.Header>
        <Modal.Title style={{ fontSize: '16px' }}>Zoom and adjust</Modal.Title>
      </Modal.Header>
      <AvatarEditor
        ref={cropRef}
        image={src}
        style={{ width: '100%', height: '100%' }}
        border={50}
        color={[0, 0, 0, 0.72]}
        scale={slideValue / 10}
        rotate={0}
      />

      <div
        className='range'
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '10px'
        }}
      >
        <input
          type='range'
          min={10}
          max={50}
          size='medium'
          value={slideValue}
          style={{ width: '80%', display: 'flex', justifyContent: 'center' }}
          onChange={e => setSlideValue(e.target.value)}
        />
      </div>

      <div
        className='buttonGroup mb-2'
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '10px'
        }}
      >
        <Button
          size='small'
          variant='outlined'
          style={{ background: '#8080805e' }}
          onClick={closeModal}
          className='btn w-60 theme_btn me-3'
        >
          Cancel
        </Button>
        <Button
          style={{ background: '#f75f06', color: 'white' }}
          size='small'
          variant='contained'
          onClick={handleSave}
          className='btn w-60 theme_btn'
        >
          Save
        </Button>
      </div>
    </Modal>
  )
}
export default CropperModalSign
