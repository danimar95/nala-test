import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Box } from '@mui/system';
import { createRef, LegacyRef, useCallback, useState } from 'react';
import { Tree } from 'react-organizational-chart';
import { Employee } from '../interfaces/general';
import ChartNode from './ChartNode';
import * as htmlToImage from "html-to-image";
import sumBy  from 'lodash/sumBy';
import { useTranslation } from 'react-i18next';

type OrganizationChartProps = {
  chart: Record<string, Employee[]>;
  employeesPerMonth: Record<string, Employee[]>;
};

const OrganizationChart = (props: OrganizationChartProps) => {
  const firstMonth =  Object.keys(props.chart)[0];
  const [month, setMonth] = useState(firstMonth);
  const { t } = useTranslation(['organization-chart']);
  const totalPayroll = sumBy(props.employeesPerMonth[month], 'grossSalary');
  const ref: LegacyRef<HTMLDivElement> | undefined = createRef();
  const downloadScreenshot = useCallback(() => {
    if (ref.current === null) {
      return
    }

    htmlToImage.toPng(ref.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'download-test.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref])

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', flexDirection: 'column'}}>
      <Box sx={{margin: '1rem'}}>
        <FormControl sx={{width: "12rem", marginRight: '2rem'}}>
          <InputLabel id="demo-simple-select-label">{t('selectLabel')}</InputLabel>
          <Select
            sx={{padding: '0.5rem'}}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={month}
            label="Select month"
            onChange={(e) => setMonth(e.target.value)}
            variant="filled"
          >
            {Object.keys(props.chart).map((month) => <MenuItem value={month} key={month} >{month}</MenuItem>)}
          </Select>
        </FormControl>
        <Button
          variant='contained'
          style={{ height: 'fit-content', color:'black', width:'10rem'}}
          onClick={downloadScreenshot}
        >
          {t('download')}
        </Button>
      </Box>
      <Box sx={{paddingX: '7rem', maxHeight: '75vh', overflow: 'auto'}}>
        <Box ref={ref} sx={{backgroundColor: 'white', borderRadius: '20px', width: 'auto', padding: '2rem'}}>
          <Tree label={
            <div>
              <div>Nala</div>
              <div>{`${t('total')} ${totalPayroll}`}</div>
            </div>
        }>
            {props.chart[month]?.map((employee) => <ChartNode key={employee.id} employee={employee} />)}
          </Tree>
        </Box>
      </Box>
    </Box>
  );
};

export default OrganizationChart;