"use client"

import type { ReactNode } from "react"
import { useTranslations } from "next-intl"

const CONTENIDO_INCLUIDO_PRECIO = (
  <div className="space-y-4 text-sm">
    <p className="font-medium text-slate-800">Seguros, coberturas y exenciones</p>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Información del seguro</h4>
      <p className="mb-2">
        Todos los vehículos de alquiler deben poseer una cobertura parcial por colisión y una cobertura en caso de robo. Existen estas opciones para cada póliza: incluida, disponible para contratar en la empresa de alquiler o proporcionada por otra entidad (p. ej., la entidad emisora de su tarjeta de crédito).
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Cobertura parcial por colisión (CDW)</h4>
      <p>
        En caso de que la carrocería resultase dañada durante el alquiler, la cantidad máxima que podrías tener que abonar sería la llamada &quot;franquicia por daños&quot;. La cobertura solo será válida en caso de cumplirse los términos del contrato de alquiler.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Cobertura en caso de robo</h4>
      <p>
        En caso de que el vehículo fuese robado, la cantidad máxima que podrías tener que abonar en concepto de reemplazo sería la llamada &quot;franquicia por robo&quot;. La cobertura solo será válida en caso de cumplirse los términos del contrato de alquiler.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Seguro de responsabilidad civil (TPL)</h4>
      <p>
        Cubre la responsabilidad del conductor por lesiones o daños a la propiedad incluidos en la póliza. No cubre, sin embargo, posibles lesiones del conductor o daños al vehículo de alquiler. La cobertura solo será válida en caso de cumplirse los términos del contrato de alquiler.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Pérdidas o daños</h4>
      <p className="mb-2">
        Si el vehículo ha sido robado, está gravemente dañado o ha sufrido daños en un accidente en el que hubo otra persona involucrada, ponte en contacto con la empresa de alquiler y la policía de forma inmediata. Si no puedes proporcionar los documentos necesarios de la policía, tendrás que hacerte cargo del coste total de reparación o sustitución del vehículo. Si los daños en el vehículo son leves y no había nadie más involucrado, ponte en contacto con la empresa de alquiler inmediatamente.
      </p>
      <p className="mb-2">
        La empresa de alquiler de coches no es responsable de la pérdida/robo o daños sufridos a cualquier pertenencia en el coche durante o después del alquiler.
      </p>
      <p>
        La compañía de alquiler le cobrará por los daños ocasionados al vehículo una vez este sea devuelto. Además, se aplicará un cargo administrativo por daños, adicional al importe retenido de la franquicia/deducible.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">No incluido en la cobertura del alquiler (CDW y cobertura en caso de robo)</h4>
      <p>
        Pérdida/robo o daños en: llaves, antenas, gato, triángulos y chalecos de seguridad, limpiaparabrisas, tapón de gasolina, fundas para maletas o cualquier otro componente fijo o móvil del coche.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Kilometraje</h4>
      <p className="mb-2">
        Su alquiler incluye kilometraje ilimitado gratuito. Modificar la duración del alquiler podría repercutir en el número de kilómetros que puede recorrer gratuitamente. Además, también podría cambiar el precio de cada kilómetro adicional.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Incluido en el precio</h4>
      <p>Sin coste adicional: tasas e impuestos locales aplicables.</p>
    </section>
  </div>
)

const CONTENIDO_NO_INCLUIDO = (
  <div className="space-y-4 text-sm">
    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Cargos locales</h4>
      <p>
        Este apartado muestra los cargos que deberá pagar en la oficina de alquiler. Estos cargos dependen de (a) el lugar de recogida, (b) el conductor y (c) donde vaya con el vehículo. No incluye los cargos adicionales que se aplicarán en la oficina de alquiler en concepto de combustible, sillas infantiles u otros servicios adicionales.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Multas</h4>
      <p>
        Usted se hace responsable de todos los cargos y sanciones, incluidos cargos por peaje, cargos de congestión y multas de tráfico.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Cargo por localidad premium</h4>
      <p className="text-slate-600">—</p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Tasas administrativas</h4>
      <p>
        En caso de que esto sea aplicable a su reserva, el precio será de 50,00 € al alquiler, incluidos impuestos.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Conductores adicionales</h4>
      <p className="mb-2">
        El conductor principal (la persona que se indica en la reserva) debe estar presente al recoger el coche y debe ser quien pague cualquier importe necesario en el mostrador. Puede haber un cargo diario para conductores adicionales. Los términos del alquiler, incluidos los cargos y restricciones relativos a la edad, se aplican a cualquier conductor adicional.
      </p>
      <p>
        Se aplicará un cargo por conductor adicional a cualquier otra persona que conduzca: 10,50 € por día, impuestos incluidos, hasta un máximo de 126,00 € por alquiler.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Asistencia en carretera</h4>
      <p>
        Es posible que tenga que pagar un extra por cualquier asistencia en carretera de urgencia que la empresa de alquiler ofrezca. Al recoger el coche, compruebe dónde está guardada la documentación necesaria. Normalmente está en la guantera o sujeta al parabrisas del vehículo.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Tasas adicionales a pagar durante la devolución / Después de su alquiler</h4>
      <p>
        En caso de costes adicionales aplicables, como multas por exceso de velocidad o tasas de congestión, la compañía de alquiler tratará de ponerse en contacto con usted cuando las autoridades soliciten la identidad del conductor. Tal proceso podría darse meses después del alquiler, y supondrá el pago de la tasa administrativa impuesta por la compañía además de la suma original por la sanción.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Otros cargos — Cargo por la limpieza y el cuidado del vehículo</h4>
      <p>
        En caso de que esto sea aplicable a su reserva, el precio será de 200,00 € al alquiler, incluidos impuestos.
      </p>
    </section>
  </div>
)

const CONTENIDO_QUE_NECESITAS_LLEVAR = (
  <div className="space-y-4 text-sm">
    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Formas de pago aceptadas en la oficina de recogida</h4>
      <p>
        El conductor principal deberá proporcionar una tarjeta de crédito o débito a su nombre durante la recogida. La tarjeta deberá contar con fondos disponibles suficientes para cubrir la cantidad de la franquicia/del depósito. Al usar una tarjeta de débito, se procederá a cobrar dicha suma. En caso de usar una tarjeta de crédito, la cantidad será &quot;bloqueada&quot;. En cualquier caso, el depósito será devuelto (o &quot;desbloqueado&quot;) después del periodo de alquiler, siempre y cuando se cumplan todas las condiciones correspondientes. La misma tarjeta será usada para pagar por impuestos locales, extras o servicios adicionales que decida contratar en el mostrador de la compañía de alquiler.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Normas sobre las tarjetas de pago</h4>
      <ul className="list-disc list-inside space-y-1 ml-2">
        <li>No se aceptan tarjetas distribuidas por neobancos (bancos que operan solo online).</li>
        <li>Si pagas con tarjeta de crédito, tu banco puede aplicar un cargo por transacción internacional.</li>
        <li>Las tarjetas de pago utilizadas en el mostrador de alquiler deben estar a nombre del conductor principal (la persona indicada en la reserva).</li>
        <li>Para ser aceptadas, las tarjetas deben tener el nombre completo del conductor principal, el número de 16 dígitos, la fecha de vencimiento y el número de seguridad de la tarjeta. Las tarjetas que no presenten la información mencionada no se aceptarán y la empresa de alquiler de coches no proporcionará el vehículo al cliente.</li>
        <li>Hay que activar las tarjetas de crédito para transacciones internacionales y pagos en el extranjero.</li>
        <li>Necesitará su número PIN para abonar el depósito.</li>
        <li>Hay que saberse el PIN de la tarjeta que se quiera usar para preautorizar el depósito.</li>
        <li>Esta empresa de alquiler no acepta tarjetas prepago, recargables ni de crédito/débito virtuales.</li>
        <li>La tarjeta de crédito utilizada para pagar el depósito de seguridad y los extras se debe haber emitido en el país de residencia del cliente.</li>
        <li>La tarjeta de crédito debe tener un chip.</li>
      </ul>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Tarjetas de pago aceptadas</h4>
      <p className="mb-2">
        El personal del mostrador solo acepta las siguientes tarjetas de crédito o de débito para el depósito (tendrás que llevar la tarjeta física contigo, y no se aceptan tarjetas de prepago, recargables ni virtuales):
      </p>
      <ul className="list-disc list-inside space-y-0.5 ml-2">
        <li>MasterCard</li>
        <li>Visa</li>
        <li>Chinese UnionPay</li>
        <li>EC-Karte</li>
      </ul>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Requisitos del permiso de conducir</h4>
      <ul className="list-disc list-inside space-y-1 ml-2">
        <li>Al retirar el vehículo, tanto el conductor principal como los conductores adicionales deberán presentar su permiso de conducir válido y en vigor.</li>
        <li>No se aceptan permisos de conducir digitales.</li>
        <li>Si ha renovado el permiso de conducir y solo muestra la fecha de la renovación, será necesario acreditar la fecha en la que se emitió por primera vez.</li>
        <li>Todos los conductores deberán poseer un permiso de conducir con una antigüedad mínima de 12 meses.</li>
        <li>En caso de llevar residiendo en España más de 6 meses, debes presentar tu permiso de conducir español.</li>
        <li>Es responsabilidad de cada conductor averiguar la documentación que necesita antes de conducir en otro país. Por ejemplo, es posible que necesite un visado o un permiso internacional de conducción, además del permiso de conducir.</li>
        <li>Cada conductor tendrá que presentar un permiso de conducir válido. Si no está escrito en caracteres latinos, también tendrá que presentar un permiso internacional de conducir o una traducción certificada. Se recomienda a cualquier conductor con un permiso de conducir de fuera de Europa que lleve también un permiso internacional de conducir.</li>
      </ul>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Formas de identificación</h4>
      <p className="mb-1">En el mostrador, deberá proporcionar:</p>
      <ul className="list-disc list-inside space-y-0.5 ml-2 mb-2">
        <li>Permiso de conducir válido de cada conductor</li>
        <li>Su vale de confirmación</li>
      </ul>
      <p className="mb-1">Documentos adicionales:</p>
      <ul className="list-disc list-inside space-y-0.5 ml-2">
        <li>Documento de identidad o pasaporte de cada conductor</li>
        <li>Prueba del domicilio del conductor principal</li>
      </ul>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Normas sobre documentos de identidad</h4>
      <ul className="list-disc list-inside space-y-1 ml-2 mb-2">
        <li>El documento de identidad/pasaporte y el permiso de conducir se deben haber expedido en el mismo país.</li>
        <li>No se aceptarán documentos de identificación virtuales o digitales (como los pasaportes digitales, por ejemplo).</li>
      </ul>
      <p className="mb-1">Para recoger el vehículo, se requieren los siguientes documentos de viaje en función del lugar de recogida:</p>
      <ul className="list-disc list-inside space-y-0.5 ml-2">
        <li><strong>Aeropuertos:</strong> un billete de avión válido.</li>
        <li><strong>Estaciones de tren:</strong> un billete de tren válido.</li>
        <li><strong>Estaciones de ferry:</strong> un billete de ferry válido.</li>
      </ul>
      <p className="mt-2">
        El billete debe ser para el viaje de vuelta o de conexión y mostrar claramente la fecha y hora de salida.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Vale de confirmación / Vale electrónico</h4>
      <p className="mb-2">
        Al retirar el vehículo, la compañía de alquiler le solicitará una copia impresa o electrónica de su vale de confirmación. Si no presenta dicha copia, el proveedor se reserva el derecho a no entregarle el vehículo o a volver a cobrarle por el alquiler.
      </p>
      <p>
        Al reservar el coche, eligió una marca y modelo &quot;o similar&quot; (&quot;similar&quot; significa la misma caja de cambios, tamaño, motor, etc.). Es posible que el personal del mostrador le asigne un coche distinto, que no sea de la marca y modelo que esperaba.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Restricciones de edad</h4>
      <p>Para conducir este coche, debe tener al menos 19 años.</p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Información de la llegada</h4>
      <p className="mb-2">
        Debes presentarte en el mostrador de alquiler a la hora de recogida programada. Algunos proveedores de servicios conceden un período de gracia limitado en caso de llegada tardía, que se detallará en el contrato de alquiler y en la sección &quot;Información importante&quot; que aceptaste al finalizar la reserva. Si llegas después de la hora de recogida y de cualquier periodo de gracia aplicable, el vehículo dejará de estar disponible y se aplicarán los gastos de cancelación estándar.
      </p>
      <p>
        Para solicitar que te guarden el vehículo en caso de retraso, debes contactar directamente con la empresa de alquiler. La disponibilidad del vehículo en este caso no está garantizada.
      </p>
    </section>
  </div>
)

const CONTENIDO_DEPOSITO_FRANQUICIA_COBERTURAS = (
  <div className="space-y-4 text-sm">
    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Información sobre la cobertura</h4>
      <p>
        Cuando recojas el coche, lee detenidamente los términos y condiciones antes de firmar el contrato de alquiler, incluso las condiciones de otros productos que puedas haber adquirido en el mostrador. Es muy importante que comprendas las exclusiones y límites del contrato o póliza, así como las normas por las que se rija cualquier producto que adquieras directamente en el mostrador.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Depósito / franquicia</h4>
      <p className="mb-2">
        Este vehículo tiene una franquicia por robo de 1.100,00 €, impuestos incluidos.
      </p>
      <p className="mb-2">
        La compañía de alquiler necesitará un depósito de 1.100,00 € al recoger el vehículo. El depósito será desbloqueado al finalizar el alquiler, siempre y cuando el vehículo sea devuelto en las condiciones acordadas.
      </p>
      <p className="mb-2">
        Este vehículo tiene una franquicia por daños de 1.100,00 €, impuestos incluidos.
      </p>
      <p className="mb-2">
        Al recoger el coche, el personal del mostrador le solicitará un depósito de seguridad para el coche. Es posible que también le soliciten un depósito de seguridad para el combustible en el depósito y en concepto de algunos extras (p. ej. silla infantil o GPS). Después del alquiler, el depósito o depósitos se devolverán.
      </p>
      <p className="mb-2">
        Debido a las fluctuaciones en los tipos de cambio y otras posibles tasas administrativas bancarias, la compañía de alquiler no se hará responsable de ninguna diferencia existente entre el importe pagado y el reembolsado.
      </p>
      <p>
        Las condiciones de la cobertura parcial por colisión y la cobertura en caso de robo tienen &quot;franquicia&quot;. La franquicia es el importe que deberá pagar antes de que la cobertura cubra el resto del coste (por cualquier concepto cubierto).
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Cobertura adicional</h4>
      <p className="mb-2">
        En la oficina de alquiler, podrá decidir si quiere contratar una cobertura adicional para reducir o eliminar la franquicia o para cubrir aquellas partes que la cobertura parcial por colisión no incluye, como los neumáticos y el parabrisas.
      </p>
      <p className="mb-2">
        <strong>Importante:</strong> Si lo hace, el contrato será entre usted y la empresa de alquiler de coches, por lo que deberá comunicarse con esta si no está satisfecho con la póliza o la cobertura recibida.
      </p>
      <p>
        Si se ve implicado en un &quot;accidente de un solo vehículo&quot; y/o la carrocería resulta dañada de forma considerable, la franquicia será mayor.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Otras coberturas</h4>
      <p className="mb-2">
        Le recomendamos que consulte los términos y condiciones de la cobertura contratada al retirar el vehículo y compruebe cuáles son sus límites y exclusiones.
      </p>
      <p className="mb-2">
        La mayoría de las coberturas normalmente excluyen parabrisas, cristales, llantas, neumáticos, bajos, interior del vehículo, objetos personales, cargos por remolque y cargos por inmovilización (mientras el vehículo está siendo reparado), así como cualquier servicio adicional contratado localmente, como pueden ser los asientos para niños y los dispositivos GPS.
      </p>
      <p>
        Tenga en cuenta que su cobertura no cubre los daños causados al vehículo en circunstancias tales como negligencia, errores de repostaje o incumplimiento de los términos del contrato de alquiler (por ejemplo, si conduce bajo la influencia del alcohol o las drogas).
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Cargos administrativos</h4>
      <p className="mb-2">
        La compañía de alquiler le cobrará por los daños ocasionados al vehículo una vez este sea devuelto. Además, se aplicará un cargo administrativo por daños, adicional al importe retenido de la franquicia/deducible.
      </p>
      <p className="mb-2">
        En caso de accidente, deberá pagar un cargo de inmovilización obligatorio, además del importe retenido de la franquicia/deducible. Este cargo se calcula teniendo en cuenta la categoría del vehículo alquilado y el número de días que este no podrá ser alquilado mientras está siendo reparado.
      </p>
      <p className="mb-2">
        Si el coche resulta dañado o robado, la empresa de alquiler cobrará un cargo administrativo. Si paga en concepto de daños/robo con una tarjeta de crédito, le cobrarán un cargo administrativo adicional.
      </p>
      <p>
        Una vez finalizado el alquiler, los clientes deberán volver a la oficina para solicitar la devolución del depósito de seguridad, que será reembolsado en la misma tarjeta en la que fue tomado.
      </p>
    </section>
  </div>
)

const CONTENIDO_OPCIONES_COMBUSTIBLE = (
  <div className="space-y-4 text-sm">
    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Políticas de combustible</h4>
      <h5 className="font-medium text-slate-800 mb-1 mt-2">Depósito al mismo nivel</h5>
      <p className="mb-2">
        Al recoger el coche, el depósito de combustible estará lleno o parcialmente lleno. Deberás dejar un depósito para cubrir el coste del combustible: el personal del mostrador bloqueará este importe en tu tarjeta de crédito. Tienes que reponer el combustible que hayas gastado justo antes de devolver el coche.
      </p>
      <p className="mb-2">
        El depósito estará lleno o parcialmente lleno. Cuando recoja el coche, compruebe cuánto combustible hay. Cuando lo devuelva, siempre que haya reemplazado el combustible que ha usado, no pagará cargos por combustible.
      </p>
      <p className="mb-2">
        Si devuelve el vehículo con menos combustible del que había en el tanque cuando se lo entregaron, la compañía de alquiler retendrá parte o la totalidad de su depósito para cubrir el combustible que falta. Esto le resultará más costoso que llenar el tanque antes de devolver el vehículo. Además del importe correspondiente al combustible, deberá abonar un cargo por servicio de repostaje de 30,00 €, incluidos impuestos. Este cargo no es reembolsable.
      </p>
      <p className="mb-2">
        Si falta combustible cuando devuelva el coche, se le cobrará un cargo por repostaje y el coste total del combustible que falta (al precio actual de mercado por litro).
      </p>
      <p className="mb-2">
        La persona que alquila el vehículo deberá llenar su depósito de combustible en un radio de 10 kilómetros desde el punto de devolución del vehículo de alquiler y presentar el recibo para evitar un cargo por repostaje.
      </p>
      <p>
        El cliente es responsable de usar el tipo de combustible correcto para el vehículo de alquiler tal y como especifica el proveedor (por ejemplo, en la tapa del depósito, en la documentación del vehículo o en el contrato de alquiler). Si se usa el tipo de combustible incorrecto, el cliente será responsable de todos los costes razonables derivados del repostaje con combustible incorrecto, incluidos los costes de reparación, sustitución y limpieza.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Coches eléctricos</h4>
      <p className="mb-2">
        Los clientes tienen la obligación de devolver el coche con el nivel de carga indicado en el contrato de alquiler, pero con un mínimo del 50 % de carga de la batería. Si se devuelve el coche con un nivel de carga inferior al acordado, el cliente tendrá que pagar por recargar el coche según las tarifas vigentes en el momento del alquiler.
      </p>
      <p className="mb-2">
        Cables de carga para vehículos eléctricos. Si los cables de carga se pierden, los roban o resultan dañados, Record Go le cobrará: hasta 1.900,00 € por el cable doméstico (tipo 1 – Schuko) y 570,00 € por el cable de la estación (tipo 2 – Mennekes).
      </p>
      <p className="mb-2">
        A la hora de recoger el vehículo, el proveedor te proporcionará un vehículo que esté parcial o totalmente cargado. Un depósito de 1,00 € se retendrá temporalmente en la tarjeta de crédito y se reembolsará cuando se devuelva el vehículo.
      </p>
      <p className="mb-2">
        A la hora de devolver el vehículo, el proveedor comprobará el nivel de la batería. Para que se considere completamente cargado, el vehículo debe tener al menos 20 kilómetros de autonomía restante.
      </p>
      <p>
        Antes de partir, el cliente es responsable de comprobar el puerto de carga del vehículo eléctrico y cualquier equipo de carga que se haya suministrado con el vehículo (por ejemplo, el cable de carga) en búsqueda de daños o defectos visibles. Si se detecta algún daño, defecto u otro problema, se debe informar al personal del mostrador inmediatamente y asegurarse de que se registre en el contrato de alquiler. Si no se comunican los daños al puerto o equipo de carga durante la recogida, podría responsabilizarse al cliente de dichos daños. El cliente es responsable de usar el puerto de carga y todo el equipo de carga del vehículo de forma segura y según las instrucciones del fabricante o proveedor durante el alquiler. Si el equipo de carga o la batería del vehículo se dañan debido a un uso inadecuado, el proveedor podría cobrar al cliente el coste de reparación o sustitución.
      </p>
    </section>
  </div>
)

const CONTENIDO_SERVICIOS_ADICIONALES_LOCAL = (
  <div className="space-y-4 text-sm">
    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Normas de las reservas de trayecto único</h4>
      <p>
        No se ofrecen alquileres de trayecto único. Tendrás que devolver el coche en el lugar de recogida.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Cruce de fronteras</h4>
      <p className="mb-2">
        Informe al personal del mostrador de Record Go si tiene pensado cruzar alguna frontera internacional.
      </p>
      <ul className="list-disc list-inside space-y-1 ml-2 mb-2">
        <li>Si recoge el coche en España peninsular, es posible que le dejen llevarlo a Francia, Portugal, Gibraltar y Andorra.</li>
        <li>Si recoge el coche en las Islas Baleares, es posible que le dejen llevarlo de Ibiza a Mallorca o Menorca (o viceversa).</li>
      </ul>
      <p className="mb-2">
        En cualquiera de estas situaciones mencionadas, el personal del mostrador le cobrará un cargo por cruce de fronteras (20,00 € por día, con un mínimo de 40,00 € y un máximo de 200,00 €).
      </p>
      <p>
        Si lleva el coche a cualquier isla o país al que no está permitido, Record Go le cobrará una penalización de 1.000,00 €, y la cobertura no será válida en estos territorios.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Servicios fuera del horario de apertura</h4>
      <p>
        Servicio fuera de horario de apertura disponible bajo petición: recogida/devolución del coche fuera del horario habitual de apertura. Conlleva un cargo de 40,00 €, que deberá abonar al firmar el contrato de alquiler.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Servicio de entrega/devolución</h4>
      <p>No hay servicio de entrega/recogida del vehículo disponible.</p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Tasas e impuestos</h4>
      <p>Todos los servicios adicionales están sujetos a los impuestos locales e impuestos sobre ventas.</p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Política de mascotas</h4>
      <p>
        Si desea que un animal entre en el coche, deberá tomar todas las precauciones necesarias para que el coche se mantenga limpio, con buen olor y sin pelos ni suciedad.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Ampliación del alquiler</h4>
      <p>No podrá ampliar este alquiler más tiempo del establecido originalmente.</p>
    </section>
  </div>
)

const CONTENIDO_SERVICIOS_ADICIONALES = (
  <div className="space-y-4 text-sm">
    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Servicios adicionales a pagar localmente</h4>
      <p className="mb-2">
        Como se explica durante el proceso de reserva, los extras (sillas infantiles, GPS, etc.) se:
      </p>
      <ul className="list-disc list-inside space-y-1 ml-2 mb-2">
        <li>incluirán en el precio del alquiler,</li>
        <li>se solicitarán y pagarán al reservar el coche o</li>
        <li>se solicitarán al reservar el coche y se pagarán al recogerlo (en cuyo caso no podemos garantizar que estén disponibles o que el precio sea el mismo).</li>
      </ul>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Términos y condiciones de los servicios adicionales</h4>
      <ul className="list-disc list-inside space-y-1 ml-2 mb-2">
        <li>Todo equipamiento o servicio adicional está sujeto a los impuestos locales y a los impuestos de venta.</li>
        <li>Si un extra se pierde, resulta dañado o es robado, tendrá que pagar los gastos de reemplazo.</li>
        <li>Si decide alquilar un vehículo en una oficina y devolverlo en otra distinta, la empresa de alquiler podrá cobrarle un cargo por devolución en otra oficina para cubrir los gastos ocasionados al tener que trasladar el vehículo de vuelta a la oficina de retirada.</li>
      </ul>
      <p className="mb-2">
        <strong>Recuerde:</strong> El personal de la oficina de alquiler no tiene formación para (ni se le permite) colocar elevadores infantiles de bebés o niños. Deberá colocarlos usted.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Conductores adicionales</h4>
      <p>Todas las restricciones y cargos relativos a la edad son aplicables a todos los conductores adicionales.</p>
    </section>
  </div>
)

const CONTENIDO_INFORMACION_IMPORTANTE = (
  <div className="space-y-4 text-sm">
    <section>
      <p className="mb-2">
        Al hacer la reserva, confirmas que has leído y aceptas las condiciones del alquiler.
      </p>
      <p className="mb-2">
        Una vez en el mostrador de alquiler, los clientes también tendrán que firmar un contrato de alquiler antes de que se les entreguen las llaves. Antes de firmar, es importante leer el contrato detenidamente y hablar con el personal del mostrador si alguna cosa no está clara.
      </p>
      <p className="mb-2">
        Su empresa de alquiler se reserva el derecho de rechazar un coche si, en opinión del personal del mostrador, el conductor no está en condiciones de conducir o cualquier miembro del grupo amenaza, abusa o pone en peligro la salud y la seguridad de otras personas de algún modo. Si esto sucede, no tendrá derecho a ningún reembolso o compensación.
      </p>
      <p className="mb-2">
        Consulte la sección &quot;Qué necesita llevar para retirar el vehículo&quot; y tenga en cuenta que el personal del mostrador no proporcionará el coche a menos que se cumplan todos los requisitos (edad, permiso de conducir, tarjeta de pago, documentación, etc.). Si esto sucede, no tendrá derecho a ningún reembolso o compensación.
      </p>
      <p>
        Antes de partir, debe revisar el coche y asegurarse de que informa de cualquier daño al personal del mostrador y de que quede constancia en el contrato de alquiler. De lo contrario, puede terminar siendo responsable de ese daño.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Normas de circulación</h4>
      <p className="mb-2">Cuando alquila un coche, se compromete a usarlo de manera responsable. No debe:</p>
      <ul className="list-disc list-inside space-y-1 ml-2 mb-2">
        <li>conducir bajo los efectos del alcohol, drogas o cualquier otro tipo de sustancia estupefaciente</li>
        <li>transportar mercancías inflamables o peligrosas, o sustancias tóxicas, corrosivas, radiactivas o nocivas de algún tipo</li>
        <li>llevar cualquier cosa que, por su olor y/o estado, pueda dañar el coche o hacer perder tiempo o dinero a la empresa de alquiler</li>
        <li>transportar animales vivos</li>
        <li>instalar una baca, un portaequipajes o similar, a menos que lo suministre la empresa de alquiler</li>
        <li>alquilar el coche a cualquier otra persona</li>
        <li>transportar pasajeros a cambio de un alquiler o compensación (taxi)</li>
        <li>participar en un rally, competición o prueba</li>
        <li>dar clases de conducir</li>
        <li>remolcar un vehículo</li>
        <li>circular por carreteras sin pavimentar o carreteras en un estado de conservación que puedan dañar el automóvil</li>
        <li>infringir de alguna forma el código de circulación, la normativa vial o cualquier otra ley</li>
      </ul>
      <p className="mb-2">
        <strong>Cinturón de seguridad:</strong> independientemente del país donde tenga lugar el alquiler, tanto el conductor como todos los pasajeros deberán llevar los cinturones de seguridad abrochados.
      </p>
      <p className="mb-2">
        Está prohibido fumar en el vehículo de alquiler. La compañía de alquiler podrá multarle si no cumple con la normativa.
      </p>
      <p className="mb-2">
        Antes de retirar el vehículo, le recomendamos que lea detenidamente los términos y condiciones de su alquiler para asegurarse de que comprende la legislación de su lugar de alquiler.
      </p>
      <p className="mb-2">
        Infórmese de los documentos que deberá llevar (por ejemplo, permiso de conducir, Documento Nacional de Identidad y tarjetas de pago) y asegúrese de que dispone de crédito suficiente para pagar cualquier extra o servicio adicional previamente solicitado. De no cumplir con los requisitos establecidos por la compañía de alquiler, esta se reserva el derecho de no entregarle el vehículo.
      </p>
      <p>
        Si pretende circular por la ciudad, podrían aplicarse restricciones al tráfico en función de la matrícula del coche. Consulte al personal del mostrador cuando vaya a recoger el vehículo.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">En la carretera</h4>
      <p className="mb-2">
        <strong>Accidente o avería:</strong> en caso de avería, accidente o dificultades técnicas, deberá llamar al proveedor del vehículo de inmediato. Deberá obtener su autorización en caso de que necesite hacer alguna reparación o recibir un vehículo de sustitución. Le recomendamos que guarde copias de toda la documentación relativa, ya que puede necesitarlas si desea hacer una reclamación. En caso de accidente, deberá presentar un informe policial y el informe de incidentes de la compañía de alquiler.
      </p>
      <p>
        Si tiene problemas con el vehículo, póngase en contacto directamente con la empresa de alquiler.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-slate-800 mb-1">Información importante sobre el proveedor del vehículo</h4>
      <h5 className="font-medium text-slate-800 mb-1 mt-2">Cálculo del precio</h5>
      <p className="mb-2">
        Los tipos de cambio pueden variar y no hay nadie en el sector de los coches de alquiler que pueda hacer algo al respecto. Por eso, es posible que en tu extracto bancario veas que algún cargo no coincide exactamente con el precio que se te comunicó al reservar. Lo mismo puede ocurrir con los reembolsos.
      </p>
      <p className="mb-2">
        Los precios de su reserva se basan en la hora de recogida y de devolución del vehículo, que usted confirmó al efectuar su reserva. Si retira el vehículo más tarde o lo devuelve antes de las fechas y horas establecidas en su reserva, no le devolverán la parte correspondiente al tiempo que no utilizó el vehículo.
      </p>
      <p className="mb-2">
        Si en el momento de la recogida decide llevarse un coche diferente, podría aplicarse un suplemento incluso si el coche nuevo es más pequeño que el que reservó inicialmente.
      </p>
      <h5 className="font-medium text-slate-800 mb-1 mt-2">Penalización</h5>
      <p className="mb-2">
        En caso de accidente, deberá pagar un cargo de inmovilización obligatorio, además del importe retenido de la franquicia/deducible. Este cargo se calcula teniendo en cuenta la categoría del vehículo alquilado y el número de días que este no podrá ser alquilado mientras está siendo reparado.
      </p>
      <p className="mb-2">
        <strong>Pérdida de llaves:</strong> en caso de que pierda la(s) llave(s), le cobrarán un cargo por sustitución.
      </p>
      <p className="mb-2">
        Si entregas el vehículo después de la hora de devolución acordada, el seguro ya no será válido. Además, se te cobrará un cargo como penalización y el precio de otro día de alquiler.
      </p>
      <h5 className="font-medium text-slate-800 mb-1 mt-2">Periodo de gracia</h5>
      <p className="mb-2">
        Debe presentarse en el mostrador de alquiler a la hora de la recogida. Si llega tarde, el coche puede no estar disponible y no le corresponderá ningún reembolso. Si cree que puede llegar tarde, es crucial que contacte con la empresa de alquiler al menos 30 minutos antes de la hora de la recogida, incluso si es a causa del retraso de un vuelo y ha proporcionado su número de vuelo.
      </p>
      <p className="mb-2">
        La empresa de alquiler mantendrá el coche durante el periodo de gracia indicado ÚNICAMENTE durante el horario de apertura de la oficina. Si se hace tarde y la empresa de alquiler está cerrada al llegar, no se podrá recoger el vehículo y se aplicarán los cargos de cancelación.
      </p>
      <p className="mb-2">
        En caso de retraso, la reserva se mantendrá durante 6 horas a partir de la hora de reserva especificada, después de lo cual se clasificará como &quot;no presentado&quot;.
      </p>
      <h5 className="font-medium text-slate-800 mb-1 mt-2">Limpieza y cuidado del vehículo</h5>
      <p className="mb-2">
        La compañía de alquiler le cobrará un importe adicional si el vehículo requiere una limpieza a fondo una vez finalizada su reserva.
      </p>
      <h5 className="font-medium text-slate-800 mb-1 mt-2">Datos de Registro Mercantil</h5>
      <p className="mb-1">Consulta los datos corporativos de la empresa de alquiler de coches a continuación:</p>
      <p className="font-mono text-xs bg-slate-100 p-2 rounded break-all">
        Record Go Alquiler Vacacional, S.A., Av. Casalduch 61 Castellón de la Plana 12005 ES, ESA12584470
      </p>
    </section>
  </div>
)

const TERMINOS_ACORDEON: { title: string; content: ReactNode }[] = [
  { title: "Incluido en el precio del alquiler", content: CONTENIDO_INCLUIDO_PRECIO },
  { title: "No incluido en el precio del alquiler", content: CONTENIDO_NO_INCLUIDO },
  { title: "¿Qué necesita llevar para retirar el vehículo?", content: CONTENIDO_QUE_NECESITAS_LLEVAR },
  { title: "Depósito, franquicia/deducible y coberturas", content: CONTENIDO_DEPOSITO_FRANQUICIA_COBERTURAS },
  { title: "Opciones de combustible", content: CONTENIDO_OPCIONES_COMBUSTIBLE },
  { title: "Servicios adicionales (a pagar localmente)", content: CONTENIDO_SERVICIOS_ADICIONALES_LOCAL },
  { title: "Servicios adicionales", content: CONTENIDO_SERVICIOS_ADICIONALES },
  { title: "Información importante", content: CONTENIDO_INFORMACION_IMPORTANTE },
]

export default function TerminosCompletosAcordeon() {
  const t = useTranslations("termsAccordion")
  return (
    <section className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <h2 className="text-lg font-semibold text-slate-900 px-4 pt-4 pb-2">{t("title")}</h2>
      <div className="space-y-1 divide-y divide-slate-100">
        {TERMINOS_ACORDEON.map((item) => (
          <details key={item.title} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
              <span>{item.title}</span>
              <span className="shrink-0 text-slate-400 transition group-open:rotate-180" aria-hidden>▼</span>
            </summary>
            <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-slate-600">
              {item.content}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
