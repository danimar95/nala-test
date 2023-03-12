import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import CSVReader from 'react-csv-reader';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import groupBy from 'lodash/groupBy';
import EditIcon from '@mui/icons-material/Edit';
import OrganizationChart from '../components/OrganizationChart';
import { Employee } from '../interfaces/general';
import constants from '../constants';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import Cookies from 'js-cookie';

const Main = () => {
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<string[][]>([]);
  const [chart, setChart] = useState<Record<string, Employee[]>>({});
  const { t } = useTranslation(['main']);
  const [employeesPerMonth, setEmployeesPerMonth] = useState<Record<string, Employee[]>>({});
  const [view, setView] = useState('table');
  const currentLanguageCode = Cookies.get('i18next') || 'en';

  const populateChildren = (allEmployees: Employee[], parent: Employee): void => {
    allEmployees.forEach((child) => {
      if (parent.id === child.parentId) {
        parent.children.push(child);
        populateChildren(allEmployees, child);
      }
    });
  };

  const createChart = (employees: Employee[]): Employee[] => {
    const parents = employees.filter((employee) => employee.parentId === constants.companyId);
    parents.forEach((employee) => populateChildren(employees, employee));
    return parents;
  }

  const handleData = (data: string[][]) => {
    setHeaders(data[0]);
    setData(data.slice(1));
    // Create tree
    const employees: Employee[] = data.slice(1).map((row: Array<string>) => {
      const employee: Employee = {
        month: row[0],
        name: row[1],
        id: row[2],
        startDate: row[3],
        grossSalary: Number(row[4]),
        division: row[5],
        area: row[6],
        subarea: row[7],
        parentId: row[8],
        hierarchicalLevel: row[9],
        children: [],
      };
      return employee;
    });

    const monthlyEmployeeGroups: Record<string, Employee[]> = groupBy(employees, 'month');
    const tree = Object.entries(monthlyEmployeeGroups).reduce((acc: Record<string, Employee[]>, [month, employees]) => {
      acc[month] = createChart(employees);
      return acc;
    }, {});
    setChart(tree);
    setEmployeesPerMonth(monthlyEmployeeGroups)
  }

  const handleEdit = (i: number) => {
    Swal.fire({
      title: String(t('title')),
      input: 'text',
      showCancelButton: true,
      confirmButtonText: String(t('confirmBtn')),
      cancelButtonText: String(t('cancelBtn')),
    }).then((result) => {
      if (result.isConfirmed) {
        const headersUpdated = headers.slice();
        headersUpdated[i] = result.value;
        setHeaders(headersUpdated);
        Swal.fire({
          title: String(t('confirmationTitle')),
          text: String(t('confirmationText')),
          icon: 'success'
        })
      }
    });
  };

  const changeLanguage = ()=> {
    i18n.changeLanguage(currentLanguageCode === "en" ? "es" : "en");
    currentLanguageCode ==='en' ? Cookies.set('i18next', 'es') : Cookies.set('i18next', 'en')
  }

  return (
    <Container disableGutters={true} maxWidth={false} sx={{display: 'flex', alignItems:'center', bgcolor: '#cfe8fc'}}>
      <Box sx={{ width: '100%', height: '100vh',display:'flex', flexDirection: 'column', justifyContent:'center', alignItems:'center', padding: '1rem' }} >
        <Box sx={{display: 'flex', justifyContent: 'center', width: '30%'}}>
          {!data.length && (
            <Button
              variant='contained'
              className="d-flex justify-content-center align-items-center btn"
              style={{ height: 'fit-content', color:'black', width:'auto'}}
            >
            <CSVReader
              parserOptions={{ header: false }}
              onFileLoaded={(data) => handleData(data)}
              inputStyle={{ display: 'none', width: '6rem', cursor:'pointer' }}
              label={t('upload')}
            />
            </Button>
          )}
          {Boolean(data.length) && (
            <Button
              variant='contained'
              className="d-flex justify-content-center align-items-center btn"
              style={{ height: 'fit-content', color:'black', width:'auto'}}
              onClick={view === "table" ? () => setView('chart') : () => setView('table')}
            >
              {view === "table" ? t('chart') : t('back')}
            </Button>
          )}
        </Box>
        {Boolean(data.length) && view === 'table' && (
          <Box sx={{padding: "3rem", maxWidth: '95%'}}>
            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
              <Table sx={{ minWidth: 650 }} size="small" stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {headers.map((header: string ,i: number) => {
                    return (
                      <TableCell key={i} align="left">
                        <Box>{header} <Button sx={{minWidth: '30px'}} onClick={(e) => handleEdit(i)}><EditIcon fontSize='small' /></Button></Box>
                      </TableCell>
                    )
                  })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row: Array<string>, i: number) => (
                    <TableRow
                      key={i}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >{row.map((data: string, i: number) => (
                      <TableCell key={i} align="left">{data}</TableCell>
                    ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {view === "chart" && (
        <OrganizationChart chart={chart} employeesPerMonth={employeesPerMonth} />
        )}
          <Button
            variant='contained'
            style={{ height: 'fit-content', color:'black', width:'auto', marginTop: '1rem'}}
            onClick={changeLanguage}
          >
            {currentLanguageCode ==='en' ? t('langEs') : t('langEn')}
          </Button>
      </Box>
    </Container>
  );
};
export default Main;