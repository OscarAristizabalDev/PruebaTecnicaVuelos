import { rutas } from './data/flightRoutes'
import { rutas2 } from './data/flightRoutes2'
import { fligth } from './model/flight';

/**
 * Permite ejecutar la busque de rutas del flights/0
 */
const findRouteFlights = (origin: string, destination: string) => {

    let finalFlights = [];

    let hasOriginFlights = rutas.some(routes => routes.departureStation == origin);
    if (!hasOriginFlights) return 'No hay vuelos con el origen'

    let hasDestinationFlights = rutas.some(routes => routes.arrivalStation == destination);
    if (!hasDestinationFlights) return 'No hay vuelos con el destino'

    // Se buscan los vuelos que tienen el mismo origen
    let originFlights = rutas.filter(route => route.departureStation == origin);

    // Se busca los vuelos directos
    let directFlights = originFlights.filter(route => route.arrivalStation == destination);

    // Se valida si la cantidad de los origenes de vuelos es igual a los vuelos directos
    if (originFlights.length == directFlights.length) // todos los vuelos son directos
    {
        return finalFlights.push(...directFlights);
    }

    // Se buscan los vuelos no directos
    let nonDirectFlights = originFlights.filter(route => route.arrivalStation != destination);

    // Se buscan los vuelos con el mismo destino
    let destinationFlights = rutas.filter(route => route.arrivalStation == destination && route.departureStation != origin);

    // Escala
    let flightLayovers = [];

    for (const nonDirect of nonDirectFlights) {
        for (const destinationFlight of destinationFlights) {
            if (nonDirect.arrivalStation == destinationFlight.departureStation) {
                flightLayovers.push(nonDirect);
                flightLayovers.push(destinationFlight);
            }
        }
    }

    if (directFlights.length > 0) {
        finalFlights.push(...directFlights);
    }

    if (nonDirectFlights.length > 0 && flightLayovers.length > 0) {
        finalFlights.push(...flightLayovers);
    }

    console.log(finalFlights);

    return finalFlights;
}

const findRouteFlights2 = async (origin: string, destination: string) => {

    let finalFlights = [];

    let hasOriginFlights = rutas2.some(routes => routes.departureStation == origin);
    if (!hasOriginFlights) return 'No hay vuelos con el origen'

    let hasDestinationFlights = rutas2.some(routes => routes.arrivalStation == destination);
    if (!hasDestinationFlights) return 'No hay vuelos con el destino'

    // Se buscan los vuelos que tienen el mismo origen
    let originFlights = rutas2.filter(route => route.departureStation == origin);

    // Se buscan los vuelos que son directos
    let directFlights = originFlights.filter(route => route.arrivalStation == destination);

    // Se valida si la cantidad de origen de vuelos es igual a los vuelos directos
    if (originFlights.length == directFlights.length) // todos los vuelos son directos 
    {
        return finalFlights.push(...directFlights);
    }

    // Se buscan aquellos vuelos que no son direcots
    let nonDirectFlights = originFlights.filter(route => route.arrivalStation != destination);

     // Se buscan los vuelos con el mismo destino
    let destinationFlights = rutas2.filter(route => route.arrivalStation == destination && route.departureStation != origin);

    // Escala
    let flightLayovers = [];

    for (const nonDirect of nonDirectFlights) {
        for (const destinationFlight of destinationFlights) {
            if (nonDirect.arrivalStation == destinationFlight.departureStation) {
                nonDirect.isValidate = true
                flightLayovers.push(nonDirect);
                flightLayovers.push(destinationFlight);
            }
        }
    }

    if (directFlights.length > 0) {
        finalFlights.push(...directFlights);
    }

    if (nonDirectFlights.length > 0 && flightLayovers.length > 0) {
        finalFlights.push(...flightLayovers);
    }

    // vuelos por validar las conexiones
    let flightsToValidate = nonDirectFlights.filter(route => route.isValidate == false);

    // Si no hay mas vuelos por validar
    if (flightsToValidate.length == 0) {
        return finalFlights;
    }

    // Se empieza a buscar vuelos con doble escala
    let flightsConnection = [];
    // Se buscan los otros vuelos
    for (const validate of flightsToValidate) {
        for (const route of rutas2) {
            if (validate.arrivalStation == route.departureStation) {
                flightsConnection.push(route);
            }
        }
    }

    let flightsDestination = await findFinalRoute(flightsConnection, destination)
}

/**
 * Metodo recursivo que permite buscar el vuelo con el mismo destino
 */
const findFinalRoute = async (flightsConnection: fligth[], destination: string) => {


    let flightsDestination = flightsConnection.filter(route => route.arrivalStation == destination);
    if (flightsDestination.length > 0) {
        return flightsDestination;
    } else {
        for (const connection of flightsConnection) {
            for (const route of rutas2) {
                if (connection.arrivalStation == route.departureStation) {
                    flightsConnection.push(route);
                }
            }
        }
        await findFinalRoute(flightsConnection, destination);
    }
}

findRouteFlights('MZL', 'BCN')
//findRouteFlights2('MZL', 'MAD')


