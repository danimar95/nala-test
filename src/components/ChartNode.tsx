import { Employee } from "../interfaces/general";
import { TreeNode } from 'react-organizational-chart';
import { Box, Button, CardMedia } from "@mui/material";
import { useState } from 'react';
import { useTranslation } from "react-i18next";

type ChartNodeProps = {
  employee: Employee,
}

const ChartNode = (props: ChartNodeProps) => {
  const [preview, setPreview] = useState<string | null>();
  const { t } = useTranslation(['chart-node']);
  const handleUpload = (e:  React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
    files && setPreview(URL.createObjectURL(files[0]))
  };

  return (
      <TreeNode label={
        <Box sx={{display: 'flex', flexDirection: 'column', margin: '1rem', alignItems: 'center'}}>
          {preview ? (
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
              <CardMedia
                sx={{ height: 100, width: 100, borderRadius:'100px' }}
                image={preview}
                title="profile-picture"
              />
            </Box>
          ) : (
            <>
            <Button variant="contained" component="label" sx={{width: '15rem'}}>
              {t('upload')}
              <input hidden accept="image/*" type="file" onChange={handleUpload}/>
            </Button>
          </>
          )}
          <Box>{props.employee.name}</Box>
          <Box>{props.employee.hierarchicalLevel}</Box>
          <Box>{props.employee.division}</Box>
          <Box>{props.employee.area}</Box>
          <Box>{`$ ${props.employee.grossSalary}`}</Box>
        </Box>
      }>
        {props.employee.children.map((child) => <ChartNode key={child.id} employee={child} />)}
      </TreeNode>
  );
};

export default ChartNode;