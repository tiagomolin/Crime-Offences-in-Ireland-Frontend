import axios from "axios";
import { API_BASE_URL } from "../config";
import { useEffect, useState } from "react";

import "../styles/crimeOffences.scss";
import { useFilters } from "../contexts/FiltersContext";
import CheckboxTree, { OnCheckNode, OnExpandNode } from "react-checkbox-tree";
import "../../node_modules/react-checkbox-tree/lib/react-checkbox-tree.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faPlusSquare,
  faMinusSquare,
  faCheckSquare,
  faSquare,
  faChevronRight,
  faSquareMinus,
} from "@fortawesome/free-solid-svg-icons";
import { Container } from "react-bootstrap";

interface Offence {
  _id: string;
  category: string;
  category_description: string;
  group_category: string;
}

interface CategoryTree {
  value: string;
  label: string;
  checked?: boolean;
  children?: CategoryTree[];
}

export function CrimeOffences() {
  const [crimeOffencesTree, setCrimeOffencesTree] = useState<CategoryTree[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { selectedOffences, setSelectedOffences } = useFilters();

  const [expandedOffences, setExpandedOffences] = useState<string[]>([]);

  function mountOffenceTree(data: Offence[]) {
    const tree: CategoryTree = {
      value: "0",
      label: "All Crime Offences",
    };
    //filters data where group_category is not null and creates a tree structure

    data
      .filter((offence) => offence.group_category === "")
      .map((offence) => {
        tree.children = (tree.children || []).concat({
          value: offence.category,
          label: offence.category_description,
        });
        data
          .filter(
            (offence_children) =>
              offence_children.group_category === offence.category
          )
          .map((offence_children) => {
            //gets the index of children in the tree with value of group_category
            const index: number = tree.children?.findIndex(
              (child) => child.value === offence_children.group_category
            )!;

            tree.children![index].children = (
              tree.children![index].children || []
            ).concat({
              value: offence_children.category,
              label: offence_children.category_description,
            });
          });
      });

    return tree;
  }

  function fetchCategoryTreeData() {
    setIsLoading(true);
    setLoadError(null);
    axios
      .get(`${API_BASE_URL}/categories`)
      .then((response) => {
        setCrimeOffencesTree([mountOffenceTree(response.data)]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadError("Offence categories could not be loaded.");
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchCategoryTreeData();
  }, []);

  function onCheckCheckbox(checked: any, node: OnCheckNode) {
    setSelectedOffences(checked);
  }

  function onExpandCheckbox(checked: any, node: OnExpandNode) {
    setExpandedOffences(checked);
  }

  return (
    <div className="crime-offences">
      <h3>Offence categories</h3>
      <Container className="container-crime-offences-filter">
        {loadError ? (
          <div className="category-state category-state-error" role="alert">
            <span>{loadError}</span>
            <button type="button" onClick={fetchCategoryTreeData}>Try again</button>
          </div>
        ) : isLoading ? (
          <div className="category-skeleton" role="status" aria-label="Loading offence categories">
            <i /><i /><i /><i />
          </div>
        ) : crimeOffencesTree.length ? (
          <CheckboxTree
            nodes={crimeOffencesTree}
            checked={selectedOffences}
            expanded={expandedOffences}
            onCheck={onCheckCheckbox}
            onExpand={onExpandCheckbox}
            icons={{
              check: <FontAwesomeIcon icon={faCheckSquare} />,
              uncheck: <FontAwesomeIcon icon={faSquare} />,
              halfCheck: <FontAwesomeIcon icon={faSquareMinus} />,
              expandClose: <FontAwesomeIcon icon={faChevronRight} size="3x" />,
              expandOpen: <FontAwesomeIcon icon={faChevronDown} />,
              expandAll: <FontAwesomeIcon icon={faPlusSquare} />,
              collapseAll: <FontAwesomeIcon icon={faMinusSquare} />,
              parentClose: null,
              parentOpen: null,
              leaf: null,
            }}
          />
        ) : (
          <p className="category-empty">No offence categories are available.</p>
        )}
      </Container>
    </div>
  );
}
