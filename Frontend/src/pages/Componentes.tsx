import Button from '../components/Button'
import Accordion from '../components/Accordion'
import AccordionItem from '../components/AccordionItem'
import Table from '../components/Table'
import ButtonToggle from '../components/ButtonToggle'
import  { ToggleContainer } from '../components/ToggleContainer'
import { ToggleOption } from '../components/ToggleOption'

function Componentes() {
      let options = [
        {content: 'A', action: () => alert('Escogiste: A')},
        {content: 'B', action: () => alert('Escogiste: B')},
        {content: 'C', action: () => alert('Escogiste: C')}
    ];
  return (
    <>
    <div className='mb-10'>
      <p className='text-4xl'>Bienvenid@ a la zona de componentes de la plantilla</p>
    </div>
    <div className='mb-5'>
      <p className='text-xl font-bold'>Botones</p>
      <Button text='Hola' />
    </div>
    <div className='mb-5'>
      <p className='text-xl font-bold'>Acordeon</p>

      <Accordion>
        <AccordionItem id='1' title='Acordeon 1'>Contenido del acordeon</AccordionItem>
        <AccordionItem id='2' title='Acordeon 2'>Contenido del acordeon</AccordionItem>
        <AccordionItem id='3' title='Acordeon 3'>Contenido del acordeon</AccordionItem>
      </Accordion>
      
      <div className='mt-5 p-5 bg-[#242424]'>
        <pre className='text-white'>
          &lt;Accordion&gt; <br />
          <span className='me-5' />&lt;AccordionItem title='Acordeon 1'&gt;Contenido...&lt;/AccordionItem&gt;<br />
          &lt;/Accordion&gt;
        </pre>
      </div>
    </div>

    <div>
      <Table tableName='Users'/>
    </div>

    <div className='mt-2'>
      <ButtonToggle />
    </div>

    <div>
      <p>Toggle Container</p>
      <ToggleContainer >
        <ToggleOption value='A'>A</ToggleOption>
        <ToggleOption value='B'>B</ToggleOption>
        <ToggleOption value='C' onSelect={() => console.log('Clickaste')}>C</ToggleOption>
      </ToggleContainer>
    </div>
    </>
  )
}

export default Componentes 